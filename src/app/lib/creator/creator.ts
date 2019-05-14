import Editor from '../editor/editor.js';
import { Disposables } from '@kano/common/index.js';
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
import { isColorConstructor } from '../../../vendor/monaco-editor/esm/vs/language/css/_deps/vscode-css-languageservice/languageFacts/facts.js';

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
    protected subscriptions : Disposables[];
    protected ui : CreatorWidget = new CreatorWidget();
    protected highlighter : Highlighter = new Highlighter();
    protected generatedSteps? : IGeneratedStep[];
    protected stepsMap : Map<string, IGeneratedStep> = new Map();
    protected stepper : T;
    private codeChangesSub? : IDisposable;
    protected app? : any;
    private loadedChallenge : any;
    protected challenge? : Challenge;
    constructor(editor : Editor) {
        this.editor = editor;
        this.subscriptions = [];
        this.stepper = this.createStepper();
        if (this.editor.injected) {
            this.onInject();
        } else {
            this.editor.onDidInject(() => this.onInject(), this, this.subscriptions);
        }
        this.ui.domNode.onDidFocusStep((step : IGeneratedStep) => this.focusTarget(step.source), this, this.subscriptions);
        this.ui.domNode.onDidPlayStep((step : IGeneratedStep) => this.playStep(step), this, this.subscriptions);
        this.ui.domNode.onDidSelectStep((step : IGeneratedStep) => this.selectStep(step), this, this.subscriptions);
        this.ui.domNode.onDidBlurStep(() => this.blurTarget(), this, this.subscriptions);
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
        this.app = this.editor.save();
        const challenge = this.generate();
        this.generatedSteps = challenge.steps;
        this.ui.domNode.setStepData(this.generatedSteps);
        this.ui.domNode.title = challenge.id;
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
        this.loadedChallenge = d;
        this.stepper.stepTo(Infinity, this.loadedChallenge);
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
    }
    playStep(step : IGeneratedStep) {
        if (this.challenge) {
            this.challenge.stop();
            this.challenge.dispose();
        }
        const previewStepper = this.createStepper();
        // Stop watching the changes to prevent the stepper to trigger a generation
        this.unwatchCodeChanges();
        previewStepper.reset();
        this.editor.load(this.app);
        const data = this.generateChallenge();
        this.challenge = this.createChallenge(data);
        const stepIndex = this.generatedSteps!.indexOf(step);
        const engine = this.challenge.engine as KanoCodeChallenge;
        const realIndex = engine.getExpandedStepIndex(stepIndex);
        previewStepper.stepTo(realIndex, data);
        this.challenge.start();
        engine.stepIndex = realIndex;
        this.ui.domNode.mode = 'play';
    }
    selectStep(step : IGeneratedStep) {
        this.stepper.reset();
        this.editor.load(this.app);
        this.ui.domNode.mode = 'edit';
        this.watchCodeChanges();
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
        this.unwatchCodeChanges();
    }
}
