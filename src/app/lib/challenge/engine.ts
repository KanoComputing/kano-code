import ChallengeEngine from 'challenge-engine/definition.js';
import Editor from '../editor/editor.js';
import { IEditorWidget } from '../editor/widget/widget.js';
import { subscribeDOM, IDisposable } from '@kano/common/index.js';
import { IStepHelper } from './helper.js';

// Trick to make the custom emitter from the challenge engine have a normal eventemitter api
(ChallengeEngine.prototype as any).on = (ChallengeEngine.prototype as any).addEventListener;

export class Engine extends ChallengeEngine {
    protected editor : Editor;
    public aliases : Map<string, string> = new Map();
    public widgets : Map<string, IEditorWidget> = new Map();
    protected subscriptions : IDisposable[] = [];
    protected helpers : IStepHelper[] = [];
    protected stepHelpers : IStepHelper[] = [];

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
    }
    onEnd() {}
    registerHelper(helper : IStepHelper) {
        this.helpers.push(helper);
    }
    dispose() {
        this.subscriptions.forEach(s => s.dispose());
        this.subscriptions.length = 0;
    }
}
