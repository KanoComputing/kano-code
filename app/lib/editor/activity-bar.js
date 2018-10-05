import { EventEmitter } from '@kano/common/index.js';
import { Plugin } from './plugin.js';
import '../../elements/kano-tooltip/kano-tooltip.js';

const DEFAULTS = {
    disabled: false,
};

class ActivityBarEntry {
    constructor(opts = {}) {
        this._onButtonClick = this._onButtonClick.bind(this);
        this.opts = Object.assign({}, opts, DEFAULTS);
        this.root = this.createDom();
        this._onDidActivate = new EventEmitter();
    }
    get onDidActivate() {
        return this._onDidActivate.event;
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
    onWillInject() {}
    _onButtonClick() {
        this._onDidActivate.fire();
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

export class ActivityBarTooltipEntry extends ActivityBarEntry {
    constructor(opts) {
        super(opts);
        this._contents = opts.root;
        this._offset = opts.offset || 0;
        if (!(this._contents instanceof HTMLElement)) {
            throw new Error('Could not create activity bar tooltip entry: Provided root is not a HTMLElement');
        }
    }
    onWillInject(container) {
        this._tooltip = document.createElement('kano-tooltip');
        this._tooltip.position = 'right';
        this._tooltip.offset = this._offset;
        this._tooltip.autoClose = true;
        this._tooltip.appendChild(this._contents);
        container.appendChild(this._tooltip);
    }
    _onButtonClick(e) {
        this._tooltip.target = this.root;
        this._tooltip.updatePosition();
        this._tooltip.open(e);
    }
    dispose() {
        super.dispose();
        if (this._tooltip) {
            this._tooltip.parentNode.removeChild(this._tooltip);
            this._tooltip = null;
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
    registerTooltipEntry(opts) {
        const entry = new ActivityBarTooltipEntry(opts);
        // Queue up entries added before injection
        if (!this.editor || !this.editor.injected) {
            this.entries.push(entry);
            return entry;
        }
        this.injectEntry(entry);
        return entry;
    }
    injectEntry(entry) {
        entry.onWillInject(this._barContainer);
        this._barContainer.appendChild(entry.root);
    }
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        this._barContainer = this.editor.root.querySelector('#activity-bar');
        this.entries.forEach(entry => this.injectEntry(entry));
        this.entries = [];
    }
}

export default ActivityBar;
