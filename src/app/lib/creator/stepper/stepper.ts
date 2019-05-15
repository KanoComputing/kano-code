import { Editor } from '../../editor/editor.js';

export class Stepper {
    protected editor : Editor;
    public mappings? : Map<number, number>;
    constructor(editor : Editor) {
        this.editor = editor;
    }
    stepTo(stepIndex : number, data : any) {}
    reset() {}
    dispose() {}
}
