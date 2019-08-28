import { Plugin } from './plugin.js';
import { MetaModule, IMetaRenderer, IAPIDefinition, IAPIJointDefinition } from '../meta-api/module.js';
import Editor from './editor.js';
import { QueryEngine } from './selector/selector.js';

export interface IToolboxWhitelist {
    [K : string] : string[];
}

export class ToolboxEntry {
    private toolbox : Toolbox;
    private entry : IAPIDefinition;
    constructor(toolbox : Toolbox, entry : IAPIDefinition) {
        this.toolbox = toolbox;
        this.entry = entry;
    }
    dispose() {
        this.toolbox.removeEntry(this.entry);
    }
    update(entry : IAPIDefinition) {
        this.toolbox.updateEntry(this.entry, entry);
        this.entry = entry;
    }
}

export class Toolbox extends Plugin {
    private editor? : Editor;
    public renderer? : IMetaRenderer;
    private entries : IAPIJointDefinition[] = [];
    private _entries : IAPIDefinition[] = [];
    private whitelist : IToolboxWhitelist|null = null;
    private installedEntries = new Set<IAPIDefinition>();
    onInstall(editor : Editor) {
        this.editor = editor;
        this.renderer = this.editor.sourceEditor.getApiRenderer();
    }
    setEntries(entries : IAPIDefinition[]) {
        this.entries = entries;
    }
    /**
     * Runs the onInstall function of the entry if available.
     * Will avoid running the onInstall more than once for the current toolbox
     * @param entry A toolbox entry
     */
    installEntry(entry : IAPIJointDefinition) {
        if (!this.editor || this.installedEntries.has(entry)) {
            return;
        }
        let realEntry : IAPIDefinition = entry;
        if (typeof entry === 'function') {
            realEntry = entry(this.editor);
        }
        const mod = this.editor.output.runner.getModule(realEntry.id || realEntry.name);
        if (typeof realEntry.onInstall === 'function') {
            realEntry.onInstall(this.editor, mod);
        }
        this._entries.push(realEntry);
        this.installedEntries.add(entry);
    }
    addEntry(entry : IAPIJointDefinition, position? : number) {
        if (!this.editor) {
            throw new Error('Could not add entry: The editor was not defined');
        }
        const injectIndex = typeof position === 'undefined' ? this.entries.length : position;
        const disposableEntry = new ToolboxEntry(this, entry);
        this.entries.splice(injectIndex, 0, entry);
        this.update();
        return disposableEntry;
    }
    removeEntry(entry : IAPIDefinition) {
        const index = this.entries.indexOf(entry);
        this.entries.splice(index, 1);
        this.update();
    }
    updateEntry(oldEntry : IAPIDefinition, entry : IAPIDefinition) {
        const index = this.entries.indexOf(oldEntry);
        this.entries.splice(index, 1, entry);
        this.update();
    }
    setWhitelist(whitelist : IToolboxWhitelist|null) {
        this.whitelist = whitelist;
        this.update();
    }
    whitelistEntry(id : string, whitelist : string[]) {
        this.whitelist = this.whitelist || {};
        this.whitelist[id] = whitelist;
        this.update();
    }
    removeWhitelistEntry(id : string) {
        if (!this.whitelist || !this.whitelist[id]) {
            return;
        }
        delete this.whitelist[id];
        this.update();
    }
    update() {
        // Not injected yet, let the inject callback generate the toolbox
        if (!this.editor || !this.editor.injected) {
            return;
        }
        this.onInject();
    }
    onInject() {
        if (!this.editor || !this.renderer) {
            return;
        }
        this.entries.forEach((entry) => {
            this.installEntry(entry);
        });
        let entries = this._entries;
        if (this.whitelist) {
            const modules = Object.keys(this.whitelist);
            entries = entries.filter(e => modules.indexOf(e.name) !== -1);
        }
        const toolbox = entries
            .map(entry => {
                let moduleWhitelist : string[]|null = null;
                if (this.whitelist && this.whitelist[entry.name]) {
                    moduleWhitelist = this.whitelist[entry.name];
                } 
                return this.renderer!.renderToolboxEntry(new MetaModule(entry, undefined), moduleWhitelist);
            })
            .filter(entry => entry);
        this.editor.sourceEditor.setToolbox(toolbox);
    }
    registerQueryHandlers(engine : QueryEngine) {
        
    }
}

export default Toolbox;
