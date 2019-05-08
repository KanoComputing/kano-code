import { EventEmitter } from '@kano/common/index.js';
import { Editor } from '../editor/editor.js';

export abstract class ChallengeBase {
    protected editor : Editor;
    protected data? : any;

    protected _onDidEnd = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }

    constructor(editor : Editor) {
        this.editor = editor;
    }
    setData(data : any) {
        this.data = data;
    }
    abstract start() : void;
}
