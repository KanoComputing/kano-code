import '@polymer/iron-a11y-keys/iron-a11y-keys.js';

export class Binding {
    constructor(keys, cb, target) {
        this.root = document.createElement('iron-a11y-keys');
        this.root.keys = keys;
        this.root.target = target;
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
