import Editor from '../editor/editor.js';
import { Disposables } from '@kano/common/index.js';
import { CreatorUI } from './ui/creator-ui.js';
import { Highlighter } from './ui/highlighter.js';
import { ToolbarEntryPosition } from '../../elements/kc-workspace-toolbar/entry.js';
import { downloadFile } from '../util/file.js';

export interface IStepData {
    [K : string] : any;
}

export interface IGeneratedStep {
    source : string;
    data : IStepData;
}

export abstract class Creator {
    protected editor : Editor;
    protected subscriptions : Disposables[];
    protected ui : CreatorUI = new CreatorUI();
    protected highlighter : Highlighter = new Highlighter();
    protected generatedSteps? : IGeneratedStep[];
    protected stepsMap : Map<string, IGeneratedStep> = new Map();
    /**
     * Store the middlewares created by the user. The generated step source will be used as a key
     */
    protected middlewares : Map<string, string> = new Map();
    constructor(editor : Editor) {
        this.editor = editor;
        this.subscriptions = [];
        if (this.editor.injected) {
            this.onInject();
        } else {
            this.editor.onDidInject(() => this.onInject(), this, this.subscriptions);
        }
        this.ui.setMiddlewares(this.middlewares);
        this.ui.onDidFocusStep((step : IGeneratedStep) => this.focusTarget(step.source), this, this.subscriptions);
        this.ui.onDidBlurStep(() => this.blurTarget(), this, this.subscriptions);
        this.ui.onDidUpdateMiddleware((info) => {
            this.middlewares.set(info.source, info.middleware);
            this.ui.setMiddlewares(this.middlewares);
        });
        this.editor.sourceEditor.onDidCodeChange(() => {
            this.onCodeChanged();
        }, this, this.subscriptions);
    }
    onCodeChanged() {
        this.generatedSteps = this.generate();
        this.ui.setStepData(this.generatedSteps);
    }
    generate() : IGeneratedStep[] {
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
        return steps;
    }
    generateChallenge() {
        const generatedStep = this.generate();
        const steps = generatedStep.map((generatedStep) => generatedStep.data);
        const app = this.editor.save();
        return {
            app,
            challenge: {
                steps,
            },
        };
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
        });
        generateButton.onDidActivate(() => {
            const challengeSource = this.generateChallenge();
            downloadFile('new-challenge.kch', JSON.stringify(challengeSource, null, '    '));
        });
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}