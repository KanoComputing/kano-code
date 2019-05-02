import { Editor } from '../editor/editor.js';
import { Dialog } from '../editor/dialogs/dialog.js';
import DialogProvider from '../editor/dialogs/dialog-provider.js';
import { html, render } from 'lit-html/lit-html.js';
import { EventEmitter } from '@kano/common/index.js';

export interface IBriefingSample {
    img : string;
    description : string;
}

export interface IBriefingData {
    id : string;
    samples : IBriefingSample[];
    instruction : string;
}

class BriefingDialogProvider extends DialogProvider {
    private data : IBriefingData;
    constructor(data : IBriefingData) {
        super();
        this.data = data;
    }
    createDom() : HTMLElement {
        const domNode = document.createElement('div');
        domNode.style.background = 'white';
        render(this.render(), domNode);
        return domNode;
    }
    render() {
        return html`
            <button dialog-dismiss>&times;</button>
            ${this.data.samples.map(sample => html`
                <div>
                    <img src=${sample.img} />
                    <span>${sample.description}</span>
                </div>
            `)}
        `;
    }
    dispose() {}
}

export class Briefing {
    protected editor : Editor;
    protected data : IBriefingData;
    protected dialog? : Dialog;

    protected _onDidEnd = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }
    
    constructor(editor : Editor, data : IBriefingData) {
        this.editor = editor;
        this.data = data;
    }
    start() {
        if (!this.editor.injected) {
            throw new Error('Could not start briefing: The editor was not injected');
        }
        this.dialog = this.editor.dialogs.registerDialog(new BriefingDialogProvider(this.data));
        this.dialog.open();
    }
    dispose() {
        if (this.dialog) {
            this.dialog.dispose();
        }
    }
}
