import '@polymer/paper-dialog/paper-dialog.js';
import { Confirm } from './confirm.js';

export class Dialog extends Confirm {
    createDom(opts) {
        const root = document.createElement('paper-dialog');
        // OverlayInto is defined, Do not use modal nor backdrop
        root.modal = typeof this.overlayInto === 'undefined';
        root.withBackdrop = typeof this.overlayInto !== 'undefined';
        root.fitInto = this.fitInto;
        root.appendChild(opts.createDom());
        return root;
    }
}

export default Dialog;
