/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { button } from '@kano/styles/button.js';
import { KanoAlert } from '../../../elements/kano-alert/kano-alert.js';
import { Base, IDialogBaseOptions, DialogElement } from './base.js';
import { EventEmitter } from '@kano/common/index.js';

export interface IDialogAlertOptions extends IDialogBaseOptions {
    heading : string;
    text : string;
    buttonLabel? : string;
}

export type KanoAlertElement = DialogElement<KanoAlert> & {
    modal? : boolean;
    withBackdrop? : boolean;
    fitInto? : HTMLElement;
    heading? : string;
    text? : string;
};

export class Alert extends Base<KanoAlertElement> {
    private _onDidClose : EventEmitter = new EventEmitter();
    get onDidClose() { return this._onDidClose.event; }
    constructor(opts : IDialogAlertOptions = { heading: '', text: ''}) {
        super(opts);
        this._onClose = this._onClose.bind(this);
        this.root.addEventListener('iron-overlay-closed', this._onClose);
    }
    createDom(opts : IDialogAlertOptions) {
        const root = new KanoAlert() as KanoAlertElement;
        root.appendChild(button.content.cloneNode(true));
        // OverlayInto is defined, Do not use modal nor backdrop
        root.modal = typeof this.overlayInto === 'undefined';
        root.withBackdrop = typeof this.overlayInto !== 'undefined';
        root.fitInto = this.fitInto;
        root.heading = opts.heading;
        root.text = opts.text;
        const buttonEl = this.createButton(opts.buttonLabel || 'Ok');
        buttonEl.className = 'btn l tertiary kano-alert-primary';
        buttonEl.setAttribute('dialog-dismiss', '');
        root.appendChild(buttonEl);
        return root;
    }
    _onClose(e : Event) {
        this._onDidClose.fire();
    }
    dispose() {
        super.dispose();
        this.root.removeEventListener('iron-overlay-closed', (e) => this._onClose(e));
    }
}

export default Alert;
