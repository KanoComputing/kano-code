/* eslint class-methods-use-this: "off" */
import { Plugin } from '../editor/plugin.js';
import { debounce } from '../util/debounce.js';
import Editor from '../editor/editor.js';

export abstract class StoragePlugin extends Plugin {
    private key : string|(() => string);
    private enabled : boolean = true;
    private debounceDelay : number;
    private _debouncedSave : Function;
    private editor? : Editor;
    constructor(key : string|(() => string), debounceDelay = 3000) {
        super();
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
    onInstall(editor : Editor) {
        this.editor = editor;
        this.editor.on('change', this._debouncedSave);
        this.editor.on('reset', this.save.bind(this));
    }
    load() {
        this.read(this.getKey())
            .then((app) => {
                if (!this.editor || !app) {
                    return;
                }
                this.editor.load(app);
            });
    }
    save() {
        if (!this.enabled || !this.editor) {
            return;
        }
        const savedApp = this.editor.export();
        this.write(this.getKey(), savedApp);
    }
    write(key : string, value : any) {
        return Promise.resolve();
    }
    read(key : string) : Promise<any> {
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
