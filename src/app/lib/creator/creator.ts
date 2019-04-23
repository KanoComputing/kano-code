import Editor from '../editor/editor.js';
import { Disposables } from '@kano/common/index.js';
import { CreatorUI } from './ui/creator-ui.js';
import { Highlighter } from './ui/highlighter.js';

export interface IStepData {
    [K : string] : any;
}

export interface IGeneratedStep {
    source : string;
    data : IStepData;
    middleware? : string;
}

export abstract class Creator {
    protected editor : Editor;
    protected subscriptions : Disposables[];
    protected ui : CreatorUI = new CreatorUI();
    protected highlighter : Highlighter = new Highlighter();
    protected generatedSteps? : IGeneratedStep[];
    constructor(editor : Editor) {
        this.editor = editor;
        this.subscriptions = [];
        if (this.editor.injected) {
            this.onInject();
        } else {
            this.editor.onDidInject(() => this.onInject(), this, this.subscriptions);
        }
        this.ui.onDidFocusStep((step : IGeneratedStep) => {
            const el = this.editor.queryElement(step.source);
            if (!el) {
                return;
            }
            this.highlighter.highlight(el);
        }, this, this.subscriptions);
        this.ui.onDidBlurStep(() => {
            this.highlighter.clear();
        }, this, this.subscriptions);
        this.ui.onDidUpdateStepData((info) => {
            if (!this.generatedSteps) {
                return;
            }
            this.generatedSteps.splice(info.index, 1, info.step);
            this.ui.setStepData(this.generatedSteps);
        });
        this.editor.sourceEditor.onDidCodeChange(() => {
            const stepData = this.generate();
            this.generatedSteps = this.generate();
            this.ui.setStepData(this.generatedSteps);
        }, this, this.subscriptions);
    }
    generate() : IGeneratedStep[] {
        return [];
    }
    onInject() {}
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}