import { BlocklySourceEditor } from '../source-editor/blockly.js';
import Editor from '../editor/editor.js';
import { transformLegacyApp } from '../legacy/loader.js';
import Output from '../output/output.js';
import Toolbox from '../editor/toolbox.js';
import { DefaultEditorProfile } from '../editor/profile.js';
import { EditorPartsManager } from '../parts/editor.js';

/**
 * Fake editor to load and render the javascript code from legacy blocks
 */
class FakeEditor {
    sourceEditor : BlocklySourceEditor;
    profile : DefaultEditorProfile;
    output : Output;
    toolbox : Toolbox;
    parts : EditorPartsManager;
    constructor(output : Output) {
        this.output = output;
        // Create a Blockly source editor to transform the blocks
        this.sourceEditor = new BlocklySourceEditor(this as unknown as Editor);
        this.profile = new DefaultEditorProfile();
        this.profile.onInstall(this as unknown as Editor);
        this.parts = new EditorPartsManager(this as unknown as Editor);
        this.profile.parts!.forEach(p => this.parts.registerAPI(p));
        // The editor has to be injected for the blockly instance to work.
        // We do not support headless editors.
        this.sourceEditor.domNode.style.display = 'none';
        document.body.appendChild(this.sourceEditor.domNode);
        this.toolbox = new Toolbox();
        this.toolbox.onInstall(this as unknown as Editor);
        this.toolbox.setEntries(this.profile.toolbox || []);
        this.toolbox.onInject();
    }
    load(data : any) : Promise<any> {
        return new Promise((resolve) => {
            const safe = transformLegacyApp(data, this.output);
            this.parts.onImport(safe);
            this.sourceEditor.onDidCodeChange((code) => {
                safe.code = code;
                resolve(safe);
            });
            this.sourceEditor.setSource(safe.source);
        });
    }
    get injected() {
        return true;
    }
    get config() {
        return {};
    }
    get workspaceView() {
        return {
            partsControls: {
                addEntry() {
                    return {
                        onDidChangeName() {}
                    }
                },
            }
        };
    }
    onDidInject() {}
    exposeMethod() {}
    dispose() {
        this.sourceEditor.domNode.remove();
        this.toolbox.onDispose();
    }
}

export function transformLegacyCreation(data : any, output : Output) {
    if (!data.code.snapshot) {
        return Promise.resolve(data);
    }
    const editor = new FakeEditor(output);
    return editor.load(data)
        .then((data) => {
            editor.dispose();
            return data;
        });
}
