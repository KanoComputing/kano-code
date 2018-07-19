import { WorkspaceViewProvider } from '../../lib/editor/workspace/index.js';

export class KanoCodeWorkspaceViewProvider extends WorkspaceViewProvider {
    constructor(component, size) {
        super();
        this.component = component;
        this.size = size;
    }
    onInstall(editor) {
        this.editor = editor;
        this.root = document.createElement(this.component);
        this.root.width = this.size.width;
        this.root.height = this.size.height;
        this.root.storeId = this.editor.store.id;
        editor.on('running-state-changed', () => {
            this.root.running = editor.getRunningState();
        });
    }
    get outputViewRoot() {
        return this.root.$.wrapper;
    }
    get partsControls() {
        return this.root.$['parts-controls'];
    }
    get toolbar() {
        return this.root.$.wrapper.$.toolbar;
    }
}

export default KanoCodeWorkspaceViewProvider;
