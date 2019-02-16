import '@polymer/paper-dialog/paper-dialog.js';
import { KanoAlertElement } from './alert.js';
import DialogProvider from './dialog-provider.js';
import { Base } from './base.js';

export class Dialog extends Base<KanoAlertElement> {
    createDom(opts : DialogProvider) {
        const root = document.createElement('paper-dialog') as KanoAlertElement;
        // OverlayInto is defined, Do not use modal nor backdrop
        root.modal = typeof this.overlayInto === 'undefined';
        root.withBackdrop = typeof this.overlayInto !== 'undefined';
        root.fitInto = this.fitInto;
        root.appendChild(opts.createDom());
        return root;
    }
    _onClose(e : CustomEvent) {
        if (e.detail.confirmed) {
            this.emit('confirm');
        } else {
            this.emit('cancel');
        }
    }
}

export default Dialog;
