import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { SourceEditor } from './source-editor.js';
import '../../../elements/kc-blockly-editor/kc-blockly-editor.js';
import { Workspace } from '@kano/kwc-blockly/blockly.js';
import Editor from '../editor.js';

export class BlocklySourceEditor implements SourceEditor {
    private editor : Editor;
    private _onDidCodeChange : EventEmitter<string> = new EventEmitter<string>();
    public domNode : HTMLElement = document.createElement('kc-blockly-editor');
    constructor(editor : Editor) {
        this.editor = editor;
        (this.domNode as any).media = this.editor.config.BLOCKLY_MEDIA || '/node_modules/@kano/kwc-blockly/blockly_built/media/';
        subscribeDOM(this.domNode, 'code-changed', (e : any) => {
            this._onDidCodeChange.fire(e.detail.value);
        });
    }
    get onDidCodeChange() {
        return this._onDidCodeChange.event;
    }
    setToolbox(toolbox : any) : void {
        (this.domNode as any).defaultCategories = toolbox;
    }
    setSource(source : string) : void {
        (this.domNode as any).blocks = source;
    }
    getSource() {
        return (this.domNode as any).getSource();
    }
    getWorkspace() : Workspace {
        return (this.domNode as any).getBlocklyWorkspace();
    }
}