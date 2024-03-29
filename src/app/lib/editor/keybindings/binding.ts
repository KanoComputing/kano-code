/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import '@polymer/iron-a11y-keys/iron-a11y-keys.js';

export class Binding {
    public root : HTMLElement;
    private cb : () => any;
    constructor(keys : string, cb : () => any, target : HTMLElement) {
        this.root = document.createElement('iron-a11y-keys');
        (this.root as any).keys = keys;
        (this.root as any).target = target;
        this.cb = cb;
        this.root.addEventListener('keys-pressed', this.cb);
    }
    dispose() {
        this.root.removeEventListener('keys-pressed', this.cb);
        if (this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }
    }
}

export default Binding;
