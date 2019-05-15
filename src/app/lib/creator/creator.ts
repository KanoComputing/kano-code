import { Editor } from '../editor/editor.js';
import { CreatorUI } from './ui/creator-ui.js';
import { Highlighter } from './ui/highlighter.js';
import { ToolbarEntryPosition } from '../../elements/kc-workspace-toolbar/entry.js';
import { downloadFile } from '../util/file.js';
import { dataURI } from '@kano/icons-rendering/index.js';
import { staffPick } from '@kano/icons/ui.js';
import { IEditorWidget } from '../editor/widget/widget.js';
import { Stepper } from './stepper/stepper.js';
import { IChallengeData, Challenge, createChallenge } from '../challenge/index.js';
import { IDisposable } from 'monaco-editor';
import KanoCodeChallenge from '../source-editor/blockly/challenge/kano-code.js';
import { CreatorDevTools } from './dev.js';

export interface IStepData {
    [K : string] : any;
}

export interface IGeneratedStep {
    source : string;
    data : IStepData;
}

export interface IGeneratedChallenge {
    id : string;
    defaultApp : string;
    steps : IGeneratedStep[];
}

export class CreatorWidget implements IEditorWidget {
    public domNode : CreatorUI = new CreatorUI();
    getDomNode() : CreatorUI {
        return this.domNode;
    }
    getPosition() : string | null {
        return null;
    }
    layout() {
        this.domNode.style.bottom = '0px';
        this.domNode.style.left = '0px';
        this.domNode.style.right = '0px';
    }
}

const VERSION = '1.0.0';

export abstract class Creator<T extends Stepper> {
    protected editor : Editor;
    protected subscriptions : IDisposable[];
    protected ui : CreatorWidget = new CreatorWidget();
    protected highlighter : Highlighter = new Highlighter();
    protected generatedSteps? : IGeneratedStep[];
    protected stepsMap : Map<string, IGeneratedStep> = new Map();
    protected stepper : T;
    private codeChangesSub? : IDisposable;
    protected app? : any;
    private loadedChallenge : any;
    protected challenge : Challenge|null = null;
    protected previewStepper : T|null = null;
    protected devTools = new CreatorDevTools();
    constructor(editor : Editor) {
        this.editor = editor;
        this.subscriptions = [];
        this.stepper = this.createStepper();
        if (this.editor.injected) {
            this.onInject();
        } else {
            this.editor.onDidInject(() => this.onInject(), this, this.subscriptions);
        }
        this.ui.domNode.onDidFocusStep((step) => this.focusTarget(step.source), this, this.subscriptions);
        this.ui.domNode.onDidPlayStep((step) => this.playStep(step), this, this.subscriptions);
        this.ui.domNode.onDidSelectStep((step) => this.selectStep(step), this, this.subscriptions);
        this.ui.domNode.onDidBlurStep(() => this.blurTarget(), this, this.subscriptions);
        this.ui.domNode.onDidClickChallengeToggle((step) => this.toggleMode(step), this, this.subscriptions);
        this.ui.domNode.onDidSelectFile((path) => this.selectFile(path), this, this.subscriptions);
        this.watchCodeChanges();
    }
    createChallenge(data : IChallengeData) {
        return createChallenge(this.editor, data);
    }
    abstract createStepper() : T;
    watchCodeChanges() {
        this.codeChangesSub = this.editor.sourceEditor.onDidCodeChange(() => {
            this.onCodeChanged();
        });
    }
    unwatchCodeChanges() {
        if (this.codeChangesSub) {
            this.codeChangesSub.dispose();
        }
    }
    onCodeChanged() {
        if (this.ui.domNode.mode === 'play') {
            return;
        }
        this.app = this.editor.save();
        const challenge = this.generate();
        this.generatedSteps = challenge.steps;
        this.ui.domNode.setStepData(this.generatedSteps);
        this.ui.domNode.title = challenge.id || 'untitled';
    }
    generate() : IGeneratedChallenge {
        const parts = this.editor.output.parts.getParts();
        const steps : IGeneratedStep[] = [];
        parts.forEach((part) => {
            const step = {
                source: `part#${part.id}`,
                data: {},
            };
            steps.push(step);
            this.stepsMap.set(step.source, step);
        });
        return { id: '', steps, defaultApp: '' };
    }
    generateChallenge() {
        const challenge = this.generate();
        const steps = challenge.steps.map((generatedStep) => generatedStep.data);
        return {
            version: VERSION,
            id: challenge.id,
            defaultApp: challenge.defaultApp,
            steps,
        };
    }
    loadChallenge(d : any) {
        const previousMode = this.ui.domNode.mode;
        const previousIndex = this.ui.domNode.selectedStepIndex;
        this.editStep();
        this.loadedChallenge = d;
        this.stepper.stepTo(Infinity, this.loadedChallenge);
        if (previousMode === 'play') {
            this.onCodeChanged();
            this.ui.domNode.selectedStepIndex = previousIndex;
            this.playStep(this.ui.domNode.selectedStep);
        }
    }
    focusTarget(source : string) {
        const el = this.editor.queryElement(source);
        if (!el) {
            return;
        }
        this.highlighter.highlight(el);
    }
    blurTarget() {
        this.highlighter.clear();
    }
    selectFile(path : string) {
        this.devTools.openFile(path);
    }
    onInject() {
        const generateButton = this.editor.workspaceToolbar.addEntry({
            id: 'generate-challenge',
            position: ToolbarEntryPosition.RIGHT,
            icon: dataURI(staffPick),
        });
        generateButton.onDidActivate(() => {
            const challengeSource = this.generateChallenge();
            downloadFile(`${challengeSource.id || 'untitled-challenge'}.kch`, JSON.stringify(challengeSource, null, '    '));
        });
        this.editor.addContentWidget(this.ui);
        this.registerKeybindings();
        this.devTools.onDidChangeFile((data) => {
            this.loadChallenge(data);
        }, this, this.subscriptions);
        this.devTools.onDidUpdateFiles((files) => {
            this.ui.domNode.files = files;
        }, this, this.subscriptions);
        this.devTools.connect();
    }
    playStep(step : IGeneratedStep) {
        this.highlighter.clear();
        if (this.challenge) {
            this.challenge.stop();
            this.challenge.dispose();
        }
        if (this.previewStepper) {
            this.previewStepper.dispose();
        }
        this.previewStepper = this.createStepper();
        // Stop watching the changes to prevent the stepper to trigger a generation
        this.previewStepper.reset();
        this.editor.load(this.app);
        const data = this.generateChallenge();
        this.challenge = this.createChallenge(data);
        const stepIndex = this.generatedSteps!.indexOf(step);
        const engine = this.challenge.engine as KanoCodeChallenge;
        const realIndex = engine.getExpandedStepIndex(stepIndex);
        this.previewStepper.stepTo(realIndex, data);
        this.challenge.start();
        engine.stepIndex = realIndex;
        this.challenge.engine!.onDidUpdateStepIndex((index) => {
            if (this.previewStepper && this.previewStepper.mappings) {
                const originalIndex = this.previewStepper.mappings.get(index);
                if (typeof originalIndex !== 'undefined') {
                    this.ui.domNode.selectedStepIndex = originalIndex;
                }
            }
        });
        this.ui.domNode.mode = 'play';
    }
    registerKeybindings() {
        this.subscriptions.push(
            this.editor.keybindings.register('>', () => this.nextStep()),
            this.editor.keybindings.register('<', () => this.previousStep()),
        );
    }
    nextStep() {
        this.ui.domNode.selectedStepIndex = Math.min(this.ui.domNode.selectedStepIndex + 1, this.ui.domNode.generatedSteps.length - 1);
        if (this.ui.domNode.mode === 'edit') {
            return;
        }
        this.playStep(this.ui.domNode.selectedStep);
    }
    previousStep() {
        this.ui.domNode.selectedStepIndex = Math.max(this.ui.domNode.selectedStepIndex - 1, 0);
        this.ui.domNode.selectedStepIndex -= 1;
        if (this.ui.domNode.mode === 'edit') {
            return;
        }
        this.playStep(this.ui.domNode.selectedStep);
    }
    selectStep(step : IGeneratedStep) {
        if (this.ui.domNode.mode === 'play') {
            this.playStep(step);
        }
    }
    toggleMode(step : IGeneratedStep) {
        if (this.ui.domNode.mode === 'edit') {
            this.playStep(step);
        } else {
            this.editStep();
        }
    }
    editStep() {
        if (this.challenge) {
            this.challenge.stop();
            this.challenge.dispose();
            this.challenge = null;
        }
        if (this.previewStepper) {
            this.previewStepper.dispose();
            this.previewStepper = null;
        }
        this.stepper.reset();
        this.editor.load(this.app);
        this.ui.domNode.mode = 'edit';
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
        this.unwatchCodeChanges();
    }
}
