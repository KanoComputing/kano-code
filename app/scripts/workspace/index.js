import { WorkspaceViewProvider } from '../../lib/editor/workspace/index.js';

export class KanoCodeWorkspaceViewProvider extends WorkspaceViewProvider {
    constructor(editor, component, size) {
        super(editor);
        this.root = document.createElement(component);
        this.root.width = size.width;
        this.root.height = size.height;
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
}

export default KanoCodeWorkspaceViewProvider;
