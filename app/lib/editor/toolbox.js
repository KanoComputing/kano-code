import Plugin from './plugin.js';
import MetaModule from '../meta-api/module.js';
// TODO: Only load the required renderer for the source type
import BlocklyMetaRenderer from '../meta-api/renderer/blockly.js';
import TypeScriptMetaRenderer from '../meta-api/renderer/typescript.js';

class Entry {
    constructor(toolbox, entry) {
        this.toolbox = toolbox;
        this.entry = entry;
    }
    dispose() {
        this.toolbox.removeEntry(this.entry);
    }
    update(entry) {
        this.toolbox.updateEntry(this.entry, entry);
        this.entry = entry;
    }
}

class Toolbox extends Plugin {
    constructor() {
        super();
        this.entries = [];
    }
    onInstall(editor) {
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
    setEntries(entries) {
        this.entries = entries;
    }
    addEntry(entry, position) {
        const injectIndex = typeof position === 'undefined' ? this.entries.length : position;
        const disposableEntry = new Entry(this, entry);
        this.entries.splice(injectIndex, 0, entry);
        this.update();
        return disposableEntry;
    }
    removeEntry(entry) {
        const index = this.entries.indexOf(entry);
        this.entries.splice(index, 1);
        this.update();
    }
    updateEntry(oldEntry, entry) {
        const index = this.entries.indexOf(oldEntry);
        this.entries.splice(index, 1, entry);
        this.update();
    }
    update() {
        // Not injected yet, let the inject callback generate the toolbox
        if (!this.editor.injected) {
            return;
        }
        this.onInject();
    }
    onInject() {
        const toolbox = this.entries
            .map(entry => this.renderer.renderToolboxEntry(new MetaModule(entry)))
            .filter(entry => entry);
        this.editor.editorActions.setToolbox(toolbox);
    }
}

export default Toolbox;
