import { Plugin } from './plugin.js';
import EventEmitter from '../util/event-emitter.js';

const DEFAULTS = {
    disabled: false,
};

class ActivityBarEntry extends EventEmitter {
    constructor(opts = {}) {
        super();
        this._onButtonClick = this._onButtonClick.bind(this);
        this.opts = Object.assign({}, opts, DEFAULTS);
        this.root = this.createDom();
    }
    createDom() {
        const dom = document.createElement('button');
        const icon = document.createElement('img');
        icon.src = this.opts.icon;
        dom.title = this.opts.title;
        dom.appendChild(icon);
        dom.addEventListener('click', this._onButtonClick);
        return dom;
    }
    _onButtonClick() {
        this.emit('activate');
    }
    dispose() {
        this.root.removeEventListener('click', this._onButtonClick);
        if (this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }
    }
    disable() {
        this.opts.disabled = true;
        this._updateDisabled();
    }
    enable() {
        this.opts.disabled = false;
        this._updateDisabled();
    }
    _updateDisabled() {
        if (this.opts.disabled) {
            this.root.setAttribute('disabled', '');
        } else {
            this.root.removeAttribute('disabled');
        }
    }
}

export class ActivityBar extends Plugin {
    constructor() {
        super();
        this.entries = [];
    }
    registerEntry(opts) {
        const entry = new ActivityBarEntry(opts);
        // Queue up entries added before injection
        if (!this.editor || !this.editor.injected) {
            this.entries.push(entry);
            return entry;
        }
        this.injectEntry(entry);
        return entry;
    }
    injectEntry(entry) {
        const root = this.editor.root.querySelector('#activity-bar');
        root.appendChild(entry.root);
    }
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        this.entries.forEach(entry => this.injectEntry(entry));
        this.entries = [];
    }
}

export default ActivityBar;
