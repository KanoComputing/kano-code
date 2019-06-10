import { Editor } from '../editor/editor.js';
import { CreatorUI } from './ui/creator-ui.js';
import { Highlighter } from './ui/highlighter.js';
import { ToolbarEntryPosition } from '../../elements/kc-workspace-toolbar/entry.js';
import { downloadFile } from '../util/file.js';
import { IEditorWidget } from '../editor/widget/widget.js';
import { Stepper } from './stepper/stepper.js';
import { IChallengeData, Challenge, createChallenge } from '../challenge/index.js';
import { IDisposable } from 'monaco-editor';
import { KanoCodeChallenge } from '../source-editor/blockly/challenge/kano-code.js';
import { CreatorDevTools } from './dev.js';
import { dataURI } from '@kano/icons-rendering/index.js';
import { download } from './ui/icons.js';
import { dispose } from '@kano/common/index.js';
import { ContributionManager } from '../contribution.js';

export interface IStepData {
    [K : string] : any;
}

export interface IGeneratedStep {
    source : string;
    data : IStepData;
}

export interface IGeneratedChallenge {
    id : string;
    name: string;
    defaultApp : string;
    steps : IGeneratedStep[];
}

export interface ICopyGenerator {
    [K : string] : (...args : any[]) => string;
}

export const CopyGenerators = new ContributionManager<ContributionManager<ICopyGenerator>>();

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

export interface ICreatorOptions {
    copyGenerator? : string;
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
    protected aliasCounter : number = -1;
    protected copyGenerator : ICopyGenerator;
    constructor(editor : Editor, opts : ICreatorOptions = { copyGenerator: 'default' }) {
        this.editor = editor;
        this.subscriptions = [];
        this.stepper = this.createStepper();
        this.stepper.developmentMode = true;
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
        this.ui.domNode.onDidClickPrevious(() => this.previousStep(), this, this.subscriptions);
        this.ui.domNode.onDidClickNext(() => this.nextStep(), this, this.subscriptions);

        const copyGenerators = CopyGenerators.get(this.editor.sourceType);

        if (!copyGenerators) {
            throw new Error(`Could not instantiate creator: Copy generator for source type '${this.editor.sourceType}' was not imported`);
        }

        const generatorId = opts.copyGenerator || 'default';

        const copyGenerator = copyGenerators.get(generatorId);

        if (!copyGenerator) {
            throw new Error(`Could not instantiate creator: Copy generator with id '${generatorId}' was not imported`);
        }

        this.copyGenerator = copyGenerator;

        this.watchCodeChanges();
    }
    createChallenge(data : IChallengeData) {
        return createChallenge(this.editor, data);
    }
    abstract createStepper() : T;
    createAlias(prefix = 'block') {
        this.aliasCounter += 1;
        return `${prefix}_${this.aliasCounter}`;
    }
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
            const type = (part.constructor as any).type;
            const step = {
                source: `part#${part.id}`,
                data: {
                    type: 'create-part',
                    alias: this.createAlias('part'),
                    part: type,
                    openPartsCopy: this.getCopy('openParts', `part.${type}`),
                },
            };
            steps.push(step);
            this.stepsMap.set(step.source, step);
            this.editor.registerAlias(step.data.alias, step.source);
        });
        return { id: '', name: '', steps, defaultApp: '{}' };
    }
    generateChallenge() {
        const challenge = this.generate();
        const steps = challenge.steps.map((generatedStep) => generatedStep.data);
        return {
            version: VERSION,
            id: challenge.id,
            name: challenge.name,
            defaultApp: challenge.defaultApp,
            steps,
        };
    }
    loadChallenge(d : any) {
        // Copy the current state, will be used to re-apply the step after everything is re-loaded
        const previousMode = this.ui.domNode.mode;
        const previousIndex = this.ui.domNode.selectedStepIndex;
        // Leave the play mode, resets everything
        this.editStep();
        // Update the local copy of the challenge
        this.loadedChallenge = d;
        // Simulate the whole challenge
        this.stepper.stepTo(Infinity, this.loadedChallenge);
        if (previousMode === 'play') {
            // The user was previewing a step, trigger a challenge generation and jump to that step
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
        this.editor.addContentWidget(this.ui);
        this.setupDownloadButton();
        this.registerKeybindings();
        this.setupDevTools();
    }
    /**
     * Add a download button to the editor's workpscae toolbar.
     * This button simply generate the challenge and triggers a download
     */
    setupDownloadButton() {
        const downloadButton = this.editor.workspaceToolbar.addEntry({
            id: 'download-challenge',
            position: ToolbarEntryPosition.RIGHT,
            icon: dataURI(download),
        });
        downloadButton.onDidActivate(() => {
            const challengeSource = this.generateChallenge();
            downloadFile(`${challengeSource.id || 'untitled-challenge'}.kch`, JSON.stringify(challengeSource, null, '    '));
        });
        this.subscriptions.push(downloadButton);
    }
    setupDevTools() {
        // The selected file changed, reload the challenge
        this.devTools.onDidChangeFile((data) => this.loadChallenge(data), this, this.subscriptions);
        // The list of available files changed, update the list in the UI
        this.devTools.onDidUpdateFiles((files) => {
            this.ui.domNode.files = files;
        }, this, this.subscriptions);
        // THe connection status changed, let the UI know
        this.devTools.onDidConnectionStatusChange((connected) => {
            this.ui.domNode.offline = !connected;
        }, this, this.subscriptions);
        // Try to connect immediately
        this.devTools.connect();
    }
    playStep(step : IGeneratedStep) {
        this.ui.domNode.mode = 'play';
        // Hide any leftover highlight from hovering
        this.highlighter.clear();
        // Clear up previous challenge and stepper
        if (this.challenge) {
            this.challenge.stop();
            this.challenge.dispose();
        }
        if (this.previewStepper) {
            this.previewStepper.dispose();
        }
        // Create a new stepper
        this.previewStepper = this.createStepper();
        // Load the app being edited
        this.editor.load(this.app);
        // Generate the challenge from the app
        const data = this.generateChallenge();
        // Create a challenge instance to go thorugh the steps
        this.challenge = this.createChallenge(data);
        // Get the index of the step we want to preview
        const stepIndex = this.generatedSteps!.indexOf(step);
        const engine = this.challenge.engine as KanoCodeChallenge;
        // Find the index of the real step that will be previewed
        const realIndex = engine.getExpandedStepIndex(stepIndex);
        // Simulate the user goinf through all steps until the target one
        this.previewStepper.stepTo(realIndex, data);
        // Start the challenge
        this.challenge.start();
        // Jump to the specific step
        engine.stepIndex = realIndex;
        // Watch step changes to update the UI accordingly
        this.challenge.engine!.onDidUpdateStepIndex((index) => {
            // Retrieve the source step using the stepper's mappings
            if (this.previewStepper && this.previewStepper.mappings) {
                const originalIndex = this.previewStepper.mappings.get(index);
                if (typeof originalIndex !== 'undefined') {
                    this.ui.domNode.selectedStepIndex = originalIndex;
                }
            }
        });
    }
    registerKeybindings() {
        // The left and right chevrons jump through steps
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
        this.editor.load(this.app);
        this.ui.domNode.mode = 'edit';
    }
    getCopy(type : string, ...args : any[]) {
        if (typeof this.copyGenerator[type] !== 'function') {
            throw new Error(`Could not generate copy: Generator for '${type}' does not exist`);
        }
        return this.copyGenerator[type](...args);
    }
    dispose() {
        this.editor.removeContentWidget(this.ui);
        dispose(this.subscriptions);
        this.subscriptions.length = 0;
        this.unwatchCodeChanges();
    }
}
