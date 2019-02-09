import { Plugin } from './plugin.js';
import MetaModule, { IMetaRenderer, IAPIDefinition } from '../meta-api/module.js';
// TODO: Only load the required renderer for the source type
import BlocklyMetaRenderer from '../meta-api/renderer/blockly.js';
import TypeScriptMetaRenderer from '../meta-api/renderer/typescript.js';
import { IEditor } from '../part/editor.js';

class Entry {
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

class Toolbox extends Plugin {
    private editor? : IEditor;
    private renderer? : IMetaRenderer;
    private entries : IAPIDefinition[] = [];
    private whitelist : any[]|null = null;
    onInstall(editor : IEditor) {
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
    addEntry(entry : IAPIDefinition, position : number) {
        const mod = this.editor!.output.runner.getModule((entry as any).id || entry.name);
        const injectIndex = typeof position === 'undefined' ? this.entries.length : position;
        const disposableEntry = new Entry(this, entry);
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
    setWhitelist(whitelist : any[]) {
        this.whitelist = whitelist;
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
        const toolbox = this.entries
            .map(entry => this.renderer!.renderToolboxEntry(new MetaModule(entry), this.whitelist))
            .filter(entry => entry);
        this.editor.sourceEditor.setToolbox(toolbox);
    }
}

export default Toolbox;
