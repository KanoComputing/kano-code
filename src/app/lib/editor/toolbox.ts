import { Plugin } from './plugin.js';
import MetaModule, { IMetaRenderer, IAPIDefinition } from '../meta-api/module.js';
// TODO: Only load the required renderer for the source type
import BlocklyMetaRenderer from '../meta-api/renderer/blockly.js';
import TypeScriptMetaRenderer from '../meta-api/renderer/typescript.js';
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
    private renderer? : IMetaRenderer;
    private entries : IAPIDefinition[] = [];
    private whitelist : IToolboxWhitelist|null = null;
    onInstall(editor : Editor) {
        this.editor = editor;
        switch (editor.sourceType) {
        case 'code': {
            this.renderer = new TypeScriptMetaRenderer();
            break;
        }
        default:
        case 'blockly': {
            this.renderer = new BlocklyMetaRenderer();
            break;
        }
        }
    }
    setEntries(entries : IAPIDefinition[]) {
        this.entries = entries;
    }
    addEntry(entry : IAPIDefinition, position? : number) {
        const mod = this.editor!.output.runner.getModule((entry as any).id || entry.name);
        const injectIndex = typeof position === 'undefined' ? this.entries.length : position;
        const disposableEntry = new ToolboxEntry(this, entry);
        this.entries.splice(injectIndex, 0, entry);
        if (typeof entry.onInstall === 'function') {
            entry.onInstall(this.editor!, mod);
        }
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
        let entries = this.entries;
        if (this.whitelist) {
            const modules = Object.keys(this.whitelist);
            entries = this.entries.filter(e => modules.indexOf(e.name) !== -1);
        }
        const toolbox = entries
            .map(entry => {
                let moduleWhitelist : string[]|null = null;
                if (this.whitelist && this.whitelist[entry.name]) {
                    moduleWhitelist = this.whitelist[entry.name];
                } 
                return this.renderer!.renderToolboxEntry(new MetaModule(entry), moduleWhitelist);
            })
            .filter(entry => entry);
        this.editor.sourceEditor.setToolbox(toolbox);
    }
    registerQueryHandlers(engine : QueryEngine) {
        
    }
}

export default Toolbox;
