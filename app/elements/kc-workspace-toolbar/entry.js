import EventEmitter from '../../lib/util/event-emitter.js';

export const ToolbarEntryPosition = {
    LEFT: 0,
    RIGHT: 1,
};

export class ToolbarEntry extends EventEmitter {
    constructor(toolbar, opts) {
        super();
        this.toolbar = toolbar;
        this.opts = opts;
        this.opts.callback = () => {
            this.emit('activate');
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
    updateIcon(icon) {
        const index = this._getIndex();
        this.toolbar.set(`entries.${index}.icon`, icon);
    }
    updateIronIcon(icon) {
        const index = this._getIndex();
        this.toolbar.set(`entries.${index}.ironIcon`, icon);
    }
    updateTitle(title) {
        const index = this._getIndex();
        this.toolbar.set(`entries.${index}.title`, title);
    }
}

export class ToolbarSettingsEntry extends EventEmitter {
    constructor(toolbar, opts) {
        super();
        this.toolbar = toolbar;
        this.opts = opts;
        this.opts.callback = () => {
            this.emit('activate');
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
    updateIcon(icon) {
        const index = this._getIndex();
        this.toolbar.set(`settingsEntries.${index}.icon`, icon);
    }
    updateIronIcon(icon) {
        const index = this._getIndex();
        this.toolbar.set(`settingsEntries.${index}.ironIcon`, icon);
    }
    updateTitle(title) {
        const index = this._getIndex();
        this.toolbar.set(`settingsEntries.${index}.title`, title);
    }
}

export default ToolbarEntry;
