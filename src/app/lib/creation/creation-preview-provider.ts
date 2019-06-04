import { Plugin } from '../editor/plugin.js';
import Editor from '../editor/editor.js';
import Output from '../output/output.js';

export abstract class CreationCustomPreviewProvider extends Plugin {
    protected editor? : Editor;
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    abstract createFile(output : Output) : Promise<Blob>|Blob;
    abstract display(blob : Blob) : void;
}

