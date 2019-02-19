import { EventEmitter } from '@kano/common/index.js';

export const ToolbarEntryPosition = {
    LEFT: 0,
    RIGHT: 1,
};

export interface IToolboarEntryOptions {
    callback?() : void;
}

export class ToolbarEntry {
    private _onDidActivate : EventEmitter = new EventEmitter();
    get onDidActivate() { return this._onDidActivate.event; }
    private toolbar : any;
    private opts : IToolboarEntryOptions;
    constructor(toolbar : any, opts : IToolboarEntryOptions) {
        this.toolbar = toolbar;
        this.opts = opts;
        this.opts.callback = () => {
            this._onDidActivate.fire();
        };
    }
    _inject() {
        this.toolbar.push('entries', this.opts);
    }
    _getIndex() {
        return this.toolbar.entries.indexOf(this.opts);
    }
    dispose() {
        const index = this._getIndex();
        this.toolbar.splice('entries', index, 1);
    }
    updateIcon(icon : string) {
        const index = this._getIndex();
        this.toolbar.set(`entries.${index}.icon`, icon);
    }
    updateIronIcon(icon : string) {
        const index = this._getIndex();
        this.toolbar.set(`entries.${index}.ironIcon`, icon);
    }
    updateTitle(title : string) {
        const index = this._getIndex();
        this.toolbar.set(`entries.${index}.title`, title);
    }
}

export interface IToolboarSettingsEntryOptions {
    callback?() : void;
}

export class ToolbarSettingsEntry {
    private _onDidActivate : EventEmitter = new EventEmitter();
    get onDidActivate() { return this._onDidActivate.event; }
    private toolbar : any;
    private opts : IToolboarSettingsEntryOptions;
    constructor(toolbar : any, opts : IToolboarSettingsEntryOptions) {
        this.toolbar = toolbar;
        this.opts = opts;
        this.opts.callback = () => {
            this._onDidActivate.fire();
        };
    }
    _inject() {
        this.toolbar.push('settingsEntries', this.opts);
    }
    _getIndex() {
        return this.toolbar.settingsEntries.indexOf(this.opts);
    }
    dispose() {
        const index = this._getIndex();
        this.toolbar.splice('settingsEntries', index, 1);
    }
    updateIcon(icon : string) {
        const index = this._getIndex();
        this.toolbar.set(`settingsEntries.${index}.icon`, icon);
    }
    updateIronIcon(icon : string) {
        const index = this._getIndex();
        this.toolbar.set(`settingsEntries.${index}.ironIcon`, icon);
    }
    updateTitle(title : string) {
        const index = this._getIndex();
        this.toolbar.set(`settingsEntries.${index}.title`, title);
    }
}

export default ToolbarEntry;
