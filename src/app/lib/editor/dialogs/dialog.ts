import '@polymer/paper-dialog/paper-dialog.js';
import { KanoAlertElement } from './alert.js';
import DialogProvider from './dialog-provider.js';
import { Base } from './base.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';

export class Dialog extends Base<KanoAlertElement> {
    private _onDidConfirm : EventEmitter = new EventEmitter();
    get onDidConfirm() { return this._onDidConfirm.event; }

    private _onDidCancel : EventEmitter = new EventEmitter();
    get onDidCancel() { return this._onDidCancel.event; }

    private _onDidClose : EventEmitter = new EventEmitter();
    get onDidClose() { return this._onDidClose.event; }

    createDom(opts : DialogProvider) {
        const root = document.createElement('paper-dialog') as KanoAlertElement;
        root.style.background = 'transparent';
        // OverlayInto is defined, Do not use modal nor backdrop
        root.modal = typeof this.overlayInto === 'undefined';
        root.withBackdrop = typeof this.overlayInto !== 'undefined';
        root.fitInto = this.fitInto;
        const domNode = opts.createDom();
        domNode.style.margin = '0px';
        subscribeDOM(root, 'iron-overlay-closed', this._onClose, this);
        root.appendChild(domNode);
        return root;
    }
    _onClose(e : CustomEvent) {
        if (e.detail.confirmed) {
            this._onDidConfirm.fire();
        } else {
            this._onDidCancel.fire();
        }
        this._onDidClose.fire();
    }
}

export default Dialog;
