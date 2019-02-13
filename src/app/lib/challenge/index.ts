import { Editor } from '../editor/editor.js';
import { KanoCodeChallenge } from './kano-code.js';
import { BlocklySourceEditor } from '../editor/source-editor/blockly.js';

interface IChallengeData {
    steps : any[];
    defaultApp? : string;
}

export class Challenge {
    public editor : Editor;
    private challengeData : IChallengeData;
    private engine? : KanoCodeChallenge;
    constructor(editor : Editor, challengeData : IChallengeData) {
        this.editor = editor;
        this.challengeData = challengeData;
        if (this.editor.injected) {
            this.onInject();
        } else {
            this.editor.onDidInject(() => this.onInject());
        }
    }
    onInject() {
        // Load the default app if provided
        if (this.challengeData.defaultApp) {
            this.editor.load(JSON.parse(this.challengeData.defaultApp));
        }
        this.engine = new KanoCodeChallenge(this.editor);
        this.engine.setSteps(this.challengeData.steps || []);
        if (this.editor.sourceType === 'blockly') {
            (this.editor.sourceEditor as BlocklySourceEditor).onDidSourceChange((e : any) => {
                if (!this.engine) {
                    return;
                }
                this.engine.triggerEvent('blockly', { event: e });
            });
        }
    }
    start() {
        if (!this.editor.injected) {
            throw new Error('Could not start challenge: Editor was not injected');
        }
        // Engine is defined as the editor is injected
        const engine = this.engine!;
        engine.start();
    }
    dispose() {
        // Here get rid of all modifications made to the editor
    }
}