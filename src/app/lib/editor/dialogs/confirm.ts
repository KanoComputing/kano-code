import { button } from '@kano/styles/button.js';
import { KanoAlert } from '../../../elements/kano-alert/kano-alert.js';
import { Alert, KanoAlertElement, IDialogAlertOptions } from './alert.js';
import { EventEmitter } from '@kano/common/index.js';

export interface IDialogConfirmOptions extends IDialogAlertOptions {}

const DEFAULT_OPTS = {
    confirmLabel: 'Confirm',
    dismissLabel: 'Cancel',
};

export class Confirm extends Alert {
    private _onDidConfirm : EventEmitter = new EventEmitter();
    get onDidConfirm() { return this._onDidConfirm.event; }

    private _onDidCancel : EventEmitter = new EventEmitter();
    get onDidCancel() { return this._onDidCancel.event; }

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
        confirm.className = 'btn l kano-alert-primary';
        confirm.setAttribute('dialog-confirm', '');
        const dismiss = this.createButton(options.dismissLabel);
        dismiss.className = 'btn l secondary kano-alert-secondary';
        dismiss.setAttribute('dialog-dismiss', '');
        root.appendChild(confirm);
        root.appendChild(dismiss);
        return root;
    }
    _onClose(e : CustomEvent) {
        if (e.detail.confirmed) {
            this._onDidConfirm.fire();
        } else {
            this._onDidCancel.fire();
        }
        super._onClose(e);
    }
}

export default Confirm;
