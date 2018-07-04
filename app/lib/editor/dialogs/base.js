import EventEmitter from '../../util/event-emitter.js';

export class Base extends EventEmitter {
    constructor(opts = {}) {
        super();
        this.fitInto = opts.fitInto || window;
        this.overlayInto = opts.overlayInto;
        this.root = this.createDom(opts);
    }
    open() {
        if (this.overlayInto) {
            this.sizeBackdrop();
        } else {
            this.resetBackdropSizing();
        }
        this.root.open();
    }
    close() {
        this.root.close();
    }
    refit() {
        this.root.refit();
    }
    sizeBackdrop() {
        const { backdropElement } = this.root;
        if (!backdropElement) {
            return;
        }
        const rect = this.overlayInto.getBoundingClientRect();
        backdropElement.style.top = `${rect.top}px`;
        backdropElement.style.left = `${rect.left}px`;
        backdropElement.style.width = `${rect.width}px`;
        backdropElement.style.height = `${rect.height}px`;
    }
    resetBackdropSizing() {
        const { backdropElement } = this.root;
        if (!backdropElement) {
            return;
        }
        backdropElement.style.top = '';
        backdropElement.style.left = '';
        backdropElement.style.width = '';
        backdropElement.style.height = '';
    }
    createDom(opts) { return null; }
    createButton(label) {
        const button = document.createElement('button');
        button.innerText = label;
        button.setAttribute('slot', 'actions');
        return button;
    }
    dispose() {
        this.root.parentNode.removeChild(this.root);
    }
}

export default Base;