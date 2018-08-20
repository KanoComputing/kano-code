/* eslint class-methods-use-this: "off" */
import Plugin from '../editor/plugin.js';
import debounce from '../util/debounce.js';

class StoragePlugin extends Plugin {
    constructor(key, debounceDelay = 3000) {
        super();
        this.enabled = true;
        this.debounceDelay = debounceDelay;
        this.key = key;
        this._debouncedSave = debounce(() => {
            this.save();
        }, debounceDelay);
    }
    disable() {
        this.enabled = false;
    }
    enable() {
        this.enabled = false;
    }
    onInstall(editor) {
        this.editor = editor;
        this.editor.on('change', this._debouncedSave);
        this.editor.on('reset', this.save.bind(this));
    }
    load() {
        this.read(this.getKey())
            .then((app) => {
                this.editor.load(app);
            });
    }
    save() {
        if (!this.enabled) {
            return;
        }
        const savedApp = this.editor.export();
        this.write(this.getKey(), savedApp);
    }
    write(key, value) {
        return Promise.resolve();
    }
    read(key) {
        return Promise.resolve({});
    }
    getKey() {
        let value = 'storage';
        if (typeof this.key === 'function') {
            value = this.key();
        } else {
            value = this.key;
        }
        return value;
    }
}

export default StoragePlugin;
