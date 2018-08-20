export const WorkspaceViewProviderMixin = base => class extends base {
    constructor(editor) {
        super();
        this.editor = editor;
    }
    clear() {}
    setOutputView(outputView) {
        if (this.outputViewRoot) {
            // Trick to get custom els added
            const root = outputView instanceof HTMLElement ? outputView : outputView.root;
            if (!root) {
                throw new Error('Could not create WorkspaceView: OutputView provided does not have a root');
            }
            this.outputViewRoot.appendChild(root);
        }
    }
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {}
    onDispose() {}
    /* eslint class-methods-use-this: "off" */
    get outputViewRoot() {
        return null;
    }
    get partsRoot() {
        return null;
    }
    get toolbar() {
        return this.root.querySelector('kc-workspace-toolbar');
    }
};

export const WorkspaceViewProvider = WorkspaceViewProviderMixin(class {});

export default WorkspaceViewProvider;
