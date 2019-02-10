import { DialogProvider } from '../../editor/dialogs/dialog-provider.js';
import { IPartDefinition } from '../editor.js';
import { EventEmitter, IDisposable, subscribeDOM } from '@kano/common/index.js';
import Editor from '../../editor/editor.js';

export class PartItem {
    public domNode : HTMLElement = document.createElement('button');
    private name : string = '';
    private _onDidClick : EventEmitter = new EventEmitter();
    private clickSub : IDisposable;
    constructor(name : string) {
        this.setName(name);
        this.clickSub = subscribeDOM(this.domNode, 'click', () => {
            this._onDidClick.fire();
        });
    }
    setName(name : string) {
        this.name = name;
        this.domNode.innerText = this.name;
    }
    get onDidClick() {
        return this._onDidClick.event;
    }
    dispose() {
        this.clickSub.dispose();
        this._onDidClick.dispose();
    }
}

export class AddPartDialogProvider extends DialogProvider {
    private editor : Editor;
    private domNode : HTMLElement = document.createElement('div');
    private partEls : PartItem[] = [];
    private _onDidClickPart : EventEmitter<string> = new EventEmitter<string>();
    constructor(editor : Editor) {
        super();
        this.editor = editor;
    }
    get onDidClickPart() {
        return this._onDidClickPart.event;
    }
    setParts(parts : IPartDefinition[]) {
        this.domNode.innerText = '';
        this.partEls = parts.map((part) => {
            const partEl = new PartItem(part.name);
            partEl.onDidClick(() => {
                this._onDidClickPart.fire(part.type);
            });
            this.domNode.appendChild(partEl.domNode);
            return partEl;
        });
    }
    createDom() : any {
        return this.domNode;
    }
    dispose() {
        super.dispose();
        this.partEls.forEach(partEl => partEl.dispose())
        this.partEls.length = 0;
    }
}

export default AddPartDialogProvider;
