import { Editor } from '../../editor/editor.js';

export class Stepper {
    protected editor : Editor;
    constructor(editor : Editor) {
        this.editor = editor;
    }
    stepTo(stepIndex : number, data : any) {}
    reset() {}
}
