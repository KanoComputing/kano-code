import '@kano/web-components/kano-alert/kano-alert.js';
import { Base } from './base.js';

export class Alert extends Base {
    constructor(opts = {}) {
        super(opts);
        this._onClose = this._onClose.bind(this);
        this.root.addEventListener('iron-overlay-closed', this._onClose);
    }
    createDom(opts) {
        const root = document.createElement('kano-alert');
        // OverlayInto is defined, Do not use modal nor backdrop
        root.modal = typeof this.overlayInto === 'undefined';
        root.withBackdrop = typeof this.overlayInto !== 'undefined';
        root.fitInto = this.fitInto;
        root.heading = opts.heading;
        root.text = opts.text;
        const button = this.createButton(opts.buttonLabel);
        button.className = 'kano-alert-secondary';
        button.setAttribute('dialog-dismiss', '');
        root.appendChild(button);
        return root;
    }
    _onClose() {
        this.emit('close');
    }
    dispose() {
        super.dispose();
        this.root.removeEventListener('iron-overlay-closed', this._onClose);
    }
}

export default Alert;
