import Editor from '../../editor/editor.js';
import { Challenge } from '../../challenge/index.js';

export class Stepper {
    challenge : Challenge;
    protected editor : Editor;
    constructor(editor : Editor, challenge : Challenge) {
        this.editor = editor;
        this.challenge = challenge
    }
    stepTo(stepIndex : number) {}
    reset() {
        this.challenge.stop();
    }
}
