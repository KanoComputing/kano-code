import '@kano/web-components/kano-alert/kano-alert.js';
import { Alert } from './alert.js';

const DEFAULT_OPTS = {
    confirmLabel: 'Confirm',
    dismissLabel: 'Cancel',
};

export class Confirm extends Alert {
    createDom(opts) {
        const options = Object.assign({}, DEFAULT_OPTS, opts);
        const root = document.createElement('kano-alert');
        // OverlayInto is defined, Do not use modal nor backdrop
        root.modal = typeof this.overlayInto === 'undefined';
        root.withBackdrop = typeof this.overlayInto !== 'undefined';
        root.fitInto = this.fitInto;
        root.heading = options.heading;
        root.text = options.text;
        const confirm = this.createButton(options.confirmLabel);
        confirm.className = 'kano-alert-primary';
        confirm.setAttribute('dialog-confirm', '');
        const dismiss = this.createButton(options.dismissLabel);
        dismiss.className = 'kano-alert-secondary';
        dismiss.setAttribute('dialog-dismiss', '');
        root.appendChild(confirm);
        root.appendChild(dismiss);
        return root;
    }
    _onClose(e) {
        if (e.detail.confirmed) {
            this.emit('confirm');
        } else {
            this.emit('cancel');
        }
        super._onClose(e);
    }
}

export default Confirm;
