import { EventEmitter } from '@kano/common/index.js';

export interface IDialogBaseOptions {
    [K : string] : any;
    fitInto? : HTMLElement;
    overlayInto? : HTMLElement;
}

export type DialogElement<T extends HTMLElement = HTMLElement> = T & {
    open() : void;
    close() : void;
    refit() : void;
    backdropElement : HTMLElement;
}

export abstract class Base<T extends DialogElement> {
    protected fitInto : HTMLElement;
    protected overlayInto? : HTMLElement;
    public root : T;
    private _onDidOpen = new EventEmitter();

    get onDidOpen() { return this._onDidOpen.event; }

    constructor(opts : IDialogBaseOptions= {}) {
        this.fitInto = opts.fitInto || document.body;
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
        requestAnimationFrame(() => {
            this._onDidOpen.fire();
        });
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
        if (!this.overlayInto) {
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
    abstract createDom(opts : IDialogBaseOptions) : T;
    createButton(label : string) {
        const button = document.createElement('button');
        button.innerText = label;
        button.setAttribute('slot', 'actions');
        return button;
    }
    dispose() {
        if (this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }
        this.resetBackdropSizing();
    }
}

export default Base;
