import ChallengeEngine from 'challenge-engine/definition.js';
import Editor from '../editor/editor.js';
import { IEditorWidget } from '../editor/widget/widget.js';
import { subscribeDOM, IDisposable, EventEmitter, dispose } from '@kano/common/index.js';
import { IStepHelper } from './helper.js';

// Trick to make the custom emitter from the challenge engine have a normal eventemitter api
(ChallengeEngine.prototype as any).on = (ChallengeEngine.prototype as any).addEventListener;

export class Engine extends ChallengeEngine {
    protected editor : Editor;
    public widgets : Map<string, IEditorWidget> = new Map();
    protected subscriptions : IDisposable[] = [];
    protected helpers : IStepHelper[] = [];
    protected stepHelpers : IStepHelper[] = [];
    public stepsMappings : Map<number, number> = new Map();
    protected aliases : IDisposable[] = [];

    protected _onDidRequestNextChallenge = new EventEmitter();
    get onDidRequestNextChallenge() { return this._onDidRequestNextChallenge.event; }

    private _onDidUpdateStepIndex : EventEmitter<number> = new EventEmitter();
    get onDidUpdateStepIndex() { return this._onDidUpdateStepIndex.event; }

    constructor(editor : Editor) {
        super();
        this.editor = editor;
        subscribeDOM(this as unknown as HTMLElement, 'done', () => this.onEnd(), this, this.subscriptions);
    }
    _updateStep() {
        super._updateStep();
        const step = this.steps[this.stepIndex];
        if (!step) {
            return;
        }
        this.stepHelpers.forEach(helper => helper.leave(this, step));
        this.stepHelpers = this.helpers.filter(helper => helper.test(this, step));
        this.stepHelpers.forEach(helper => helper.enter(this, step));
        this._onDidUpdateStepIndex.fire(this.stepIndex);
    }
    onEnd() {}
    registerAlias(alias : string, target : string) {
        this.aliases.push(this.editor.registerAlias(alias, target));
    }
    registerHelper(helper : IStepHelper) {
        this.helpers.push(helper);
    }
    getExpandedStepIndex(sourceIndex : number) {
        let step;
        let counter = 0;
        // Go through all steps until the source index
        for (let i = 0; i < this._steps.length && i < sourceIndex; i += 1) {
            step = this._steps[i];
            // Shorthand exists
            if (step.type && this._shorthands[step.type]) {
                // Expand this step
                const expanded = this._shorthands[step.type](step);
                // Add the number of expanded steps
                counter += (Array.isArray(expanded) ? expanded.length : 1);
            } else {
                // Add one only when no shorthand exist
                counter += 1;
            }
        }
        // Counter contains the number of steps 
        return counter;
    }
    _expandStepsWithMappings() {
        // Store the mappings between generated steps and original steps
        const mappings = new Map();
        // Create a new Array of steps with the expanded shorthands
        const steps = this._steps.reduce((acc, step, index) => {
            if (step.type && this._shorthands[step.type]) {
                // A shorthand exist, use the processor to get all the steps
                const result = this._shorthands[step.type](step);
                if (Array.isArray(result)) {
                    // We got some expanded steps, map all their new indexes to their original step
                    result.forEach((r : any, i : number) => {
                        mappings.set(acc.length + i, index);
                    });
                } else {
                    mappings.set(acc.length, index);
                }
                return acc.concat(result);
            }
            // No expansion, map the step index to the current index
            mappings.set(acc.length, index);
            // No, shorthands, return the original step
            return acc.concat(step);
        }, []);
        return { steps, mappings };
    }
    dispose() {
        dispose(this.subscriptions)
        this.subscriptions.length = 0;
        dispose(this.aliases);
        this.aliases.length = 0;
        this.widgets.forEach((widget) => {
            this.editor.removeContentWidget(widget);
        });
        this._onDidUpdateStepIndex.dispose();
    }
}
