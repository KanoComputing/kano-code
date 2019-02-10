import Editor from '../editor.js';
import { KCPartsControls } from '../../../elements/kc-workspace-frame/kc-parts-controls.js';

export abstract class WorkspaceViewProvider {
    protected editor : Editor;
    constructor(editor : Editor) {
        this.editor = editor;
    }
    clear() {}
    setOutputView(outputView : any) {
        if (this.outputViewRoot) {
            // Trick to get custom els added
            const root = outputView instanceof HTMLElement ? outputView : outputView.root;
            if (!root) {
                throw new Error('Could not create WorkspaceView: OutputView provided does not have a root');
            }
            root.setAttribute('slot', 'workspace');
            this.outputViewRoot.appendChild(root);
        }
    }
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    onInject() {}
    onDispose() {}
    /* eslint class-methods-use-this: "off" */
    abstract get outputViewRoot() : HTMLElement;
    abstract get partsControls() : KCPartsControls;
    get toolbar() {
        return (this as any).root.querySelector('kc-workspace-toolbar');
    }
};

export default WorkspaceViewProvider;
