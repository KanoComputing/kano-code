import { button } from '@kano/styles/button.js';
import { KanoAlert } from '../../../elements/kano-alert/kano-alert.js';
import { Alert, KanoAlertElement, IDialogAlertOptions } from './alert.js';

export interface IDialogConfirmOptions extends IDialogAlertOptions {}

const DEFAULT_OPTS = {
    confirmLabel: 'Confirm',
    dismissLabel: 'Cancel',
};

export class Confirm extends Alert {
    createDom(opts : IDialogConfirmOptions) {
        const options = Object.assign({}, DEFAULT_OPTS, opts);
        const root = new KanoAlert() as KanoAlertElement;
        root.appendChild(button.content.cloneNode(true));
        // OverlayInto is defined, Do not use modal nor backdrop
        root.modal = typeof this.overlayInto === 'undefined';
        root.withBackdrop = typeof this.overlayInto !== 'undefined';
        root.fitInto = this.fitInto;
        root.heading = options.heading;
        root.text = options.text;
        const confirm = this.createButton(options.confirmLabel);
        confirm.className = 'btn kano-alert-primary';
        confirm.setAttribute('dialog-confirm', '');
        const dismiss = this.createButton(options.dismissLabel);
        dismiss.className = 'btn secondary kano-alert-secondary';
        dismiss.setAttribute('dialog-dismiss', '');
        root.appendChild(confirm);
        root.appendChild(dismiss);
        return root;
    }
    _onClose(e : CustomEvent) {
        if (e.detail.confirmed) {
            this.emit('confirm');
        } else {
            this.emit('cancel');
        }
        super._onClose(e);
    }
}

export default Confirm;
