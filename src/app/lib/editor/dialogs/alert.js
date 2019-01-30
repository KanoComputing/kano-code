import { button } from '@kano/styles/button.js';
import '../../../elements/kano-alert/kano-alert.js';
import { Base } from './base.js';

export class Alert extends Base {
    constructor(opts = {}) {
        super(opts);
        this._onClose = this._onClose.bind(this);
        this.root.addEventListener('iron-overlay-closed', this._onClose);
    }
    createDom(opts) {
        const root = document.createElement('kano-alert');
        root.appendChild(button.content.cloneNode(true));
        // OverlayInto is defined, Do not use modal nor backdrop
        root.modal = typeof this.overlayInto === 'undefined';
        root.withBackdrop = typeof this.overlayInto !== 'undefined';
        root.fitInto = this.fitInto;
        root.heading = opts.heading;
        root.text = opts.text;
        const buttonEl = this.createButton(opts.buttonLabel || 'Ok');
        buttonEl.className = 'btn tertiary kano-alert-primary';
        buttonEl.setAttribute('dialog-dismiss', '');
        root.appendChild(buttonEl);
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
