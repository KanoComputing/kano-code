import { Disposables } from '@kano/common/index.js';
import { WorkspaceViewProvider } from './index.js';
import '../../../elements/kc-workspace-frame/kc-workspace-frame.js';
import '../../../elements/kc-workspace-frame/kc-parts-controls.js';

export class DefaultWorkspaceViewProvider extends WorkspaceViewProvider {
    constructor(...args) {
        super(...args);
        this.subscriptions = new Disposables();

        this.root = document.createElement('div');

        this.frame = document.createElement('kc-workspace-frame');
        this.frame.style.margin = '0 40px';

        this.partsControls = document.createElement('kc-parts-controls');
        this.partsControls.setAttribute('slot', 'controls');

        this.frame.appendChild(this.partsControls);

        this.root.appendChild(this.frame);
    }
    onInstall(editor) {
        this.editor = editor;

        this.frame.width = this.editor.output.visuals.width;
        this.frame.height = this.editor.output.visuals.height;

        // Required until all workspace components get rid of Store based bindings
        this.partsControls.storeId = this.editor.store.id;
    }
    dispose() {
        this.subscriptions.dispose();
    }
    get toolbar() {
        return this.frame.shadowRoot.querySelector('kc-workspace-toolbar');
    }
    get outputViewRoot() {
        return this.frame;
    }
}

export default DefaultWorkspaceViewProvider;
