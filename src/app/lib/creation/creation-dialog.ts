import { DialogProvider } from '../editor/dialogs/dialog-provider.js';
import { IDisposable, EventEmitter, subscribeDOM } from '@kano/common/index.js';
import './components/kc-creation-form.js';

export interface ICreationSubmission {
    title : string;
    description : string;
}

export class CreationDialogProvider extends DialogProvider {
    private subscriptions : IDisposable[] = [];
    private form : HTMLElement;
    private previewDiv : HTMLElement;

    private _onDidSubmit : EventEmitter<ICreationSubmission> = new EventEmitter();
    get onDidSubmit() { return this._onDidSubmit.event; }

    private _onDidDismiss : EventEmitter = new EventEmitter();
    get onDidDismiss() { return this._onDidDismiss.event; }

    constructor() {
        super();
        this.form = document.createElement('kc-creation-form');
        this.form.style.margin = '0';
        this.form.style.padding = '0';
        this.previewDiv = document.createElement('div');
        this.previewDiv.style.width = '100%';
        this.previewDiv.style.height = '100%';
        this.previewDiv.style.textAlign = 'center';
        this.previewDiv.setAttribute('slot', 'preview');

        const shareSubscription = subscribeDOM(this.form, 'submit', this._onSubmit.bind(this));
        const dismissSubscription = subscribeDOM(this.form, 'dismiss', this._onDismiss.bind(this));
        this.subscriptions.push(shareSubscription, dismissSubscription);

        this.form.appendChild(this.previewDiv);
    }
    _onSubmit(e : CustomEvent) {
        this._onDidSubmit.fire({
            title: e.detail.title,
            description: e.detail.description,
        });
    }
    _onDismiss() {
        this._onDidDismiss.fire();
    }
    createDom() {
        return this.form;
    }
    getPreviewSlot() {
        return this.previewDiv;
    }
    resetPreviewSlot() {
        while (this.previewDiv.lastChild) {
            this.previewDiv.removeChild(this.previewDiv.lastChild);
        }
    }
    setRecording(state : boolean) {
        (this.form as any).recording = state;
    }
    setPage(page : string) {
        (this.form as any).page = page;
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}

export default CreationDialogProvider;
