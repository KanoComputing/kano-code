import { EventEmitter } from '@kano/common/index.js';
import { Plugin } from './plugin.js';
import '../../elements/kano-tooltip/kano-tooltip.js';
import { IEditor } from '../part/editor.js';

const SIZES = Object.freeze({
    BIG: 'big',
    DEFAULT: 'default',
});

const DEFAULTS = {
    disabled: false,
    important: false,
    size: SIZES.DEFAULT,
};

const SIZES_ARRAY = Object.values(SIZES);

export interface IActivityBarEntryOptions {
    size : string;
    icon? : string;
    important? : boolean;
    title? : string;
    disabled? : boolean;
}

class ActivityBarEntry {
    private _bar : ActivityBar;
    private opts : IActivityBarEntryOptions;
    public root : HTMLElement;
    private _onDidActivate : EventEmitter;
    constructor(bar : ActivityBar, opts : Partial<IActivityBarEntryOptions> = {}) {
        this._bar = bar;
        this._onButtonClick = this._onButtonClick.bind(this);
        this.opts = Object.assign({}, DEFAULTS, opts);
        if (SIZES_ARRAY.indexOf(this.opts.size) === -1) {
            throw new Error(`Could not create ActivityBarEntry: '${this.opts.size}' is not a valid size`);
        }
        this.root = this.createDom();
        this._onDidActivate = new EventEmitter();
    }
    get onDidActivate() {
        return this._onDidActivate.event;
    }
    createDom() {
        const dom = document.createElement('button');
        const icon = document.createElement('img');
        if (this.opts.icon) {
            icon.src = this.opts.icon;
        }
        icon.classList.add(this.opts.size);
        if (this.opts.important) {
            icon.classList.add('important');
        }
        if (this.opts.title) {
            dom.title = this.opts.title;
        }
        dom.appendChild(icon);
        dom.addEventListener('click', this._onButtonClick);
        return dom;
    }
    onWillInject(_ : HTMLElement) {}
    _onButtonClick(e : any) {
        this._onDidActivate.fire();
    }
    dispose() {
        this.root.removeEventListener('click', this._onButtonClick);
        if (this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }
        const index = this._bar.entries.indexOf(this);
        this._bar.entries.splice(index, 1);
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

export interface IActivityBarTooltipEntryOptions extends Partial<IActivityBarEntryOptions> {
    root : HTMLElement;
    offset? : number;
}

interface ITooltipElement extends HTMLElement {
    position? : string;
    offset? : number;
    autoClose? : boolean;
    target? : HTMLElement;
    updatePosition() : void;
    open(e : any) : void;
}

export class ActivityBarTooltipEntry extends ActivityBarEntry {
    private _contents : HTMLElement;
    private _offset : number;
    private _tooltip? : ITooltipElement;
    constructor(bar : ActivityBar, opts : IActivityBarTooltipEntryOptions) {
        super(bar, opts);
        this._contents = opts.root;
        this._offset = opts.offset || 0;
        if (!(this._contents instanceof HTMLElement)) {
            throw new Error('Could not create activity bar tooltip entry: Provided root is not a HTMLElement');
        }
    }
    onWillInject(container : HTMLElement) {
        this._tooltip = document.createElement('kano-tooltip') as ITooltipElement;
        this._tooltip.position = 'right';
        this._tooltip.offset = this._offset;
        this._tooltip.autoClose = true;
        this._tooltip.appendChild(this._contents);
        container.appendChild(this._tooltip);
    }
    _onButtonClick(e : any) {
        if (!this._tooltip) {
            return;
        }
        this._tooltip.target = this.root;
        this._tooltip.updatePosition();
        this._tooltip.open(e);
    }
    dispose() {
        super.dispose();
        if (this._tooltip && this._tooltip.parentNode) {
            this._tooltip.parentNode.removeChild(this._tooltip);
        }
    }
}

export class ActivityBar extends Plugin {
    private editor? : IEditor;
    public entries : ActivityBarEntry[] = [];
    private _barContainer? : HTMLElement;
    registerEntry(opts : Partial<IActivityBarEntryOptions>) {
        const entry = new ActivityBarEntry(this, opts);
        // Queue up entries added before injection
        if (!this.editor || !this.editor.injected) {
            this.entries.push(entry);
            return entry;
        }
        this.injectEntry(entry);
        return entry;
    }
    registerTooltipEntry(opts : IActivityBarTooltipEntryOptions) {
        const entry = new ActivityBarTooltipEntry(this, opts);
        // Queue up entries added before injection
        if (!this.editor || !this.editor.injected) {
            this.entries.push(entry);
            return entry;
        }
        this.injectEntry(entry);
        return entry;
    }
    injectEntry(entry : ActivityBarEntry) {
        if (!this._barContainer) {
            return;
        }
        entry.onWillInject(this._barContainer);
        if (this._barContainer) {
            this._barContainer.appendChild(entry.root);
        }
    }
    onInstall(editor : IEditor) {
        this.editor = editor;
    }
    onInject() {
        if (!this.editor) {
            return;
        }
        const container = this.editor.rootEl.querySelector('#activity-bar') as HTMLElement;
        if (!container) {
            return;
        }
        this._barContainer = container;
        this.entries.forEach(entry => this.injectEntry(entry));
        this.entries = [];
    }
    get size() {
        return SIZES;
    }
}

export default ActivityBar;
