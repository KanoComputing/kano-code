import { Editor } from '../../editor/editor.js';
import { IChallengeData } from '../../challenge/index.js';

export class Stepper {
    protected editor : Editor;
    public developmentMode = false;
    public mappings? : Map<number, number>;
    /**
     * Creates a relationship between an element in the app and its original step
     * This can be used to make sure changes to a challenge file are re-applied to a new challenge
     */
    public originalSteps : Map<string, any> = new Map();
    constructor(editor : Editor) {
        this.editor = editor;
    }
    stepTo(stepIndex : number, data : any) {
        this.reset();
    }
    reset() {
        this.originalSteps.clear();
    }
    stripGeneratorSteps(data : IChallengeData) {

    }
    dispose() {
        this.originalSteps.clear();
    }
}
