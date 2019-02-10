import { Disposables } from '@kano/common/index.js';
import { WorkspaceViewProvider } from './index.js';
import '../../../elements/kc-workspace-frame/kc-workspace-frame.js';
import '../../../elements/kc-workspace-frame/kc-parts-controls.js';
import Editor from '../editor.js';
import { KCPartsControls } from '../../../elements/kc-workspace-frame/kc-parts-controls.js';

export class DefaultWorkspaceViewProvider extends WorkspaceViewProvider {
    private subscriptions : Disposables = new Disposables();
    private root : HTMLElement = document.createElement('div');
    private frame : HTMLElement = document.createElement('kc-workspace-frame');
    public partsControls : KCPartsControls = document.createElement('kc-parts-controls') as KCPartsControls;
    constructor(editor : Editor) {
        super(editor);
        this.root = document.createElement('div');
        this.frame.style.margin = '0 40px';
        this.partsControls.setAttribute('slot', 'controls');

        this.frame.appendChild(this.partsControls);

        this.root.appendChild(this.frame);
    }
    onInstall(editor : Editor) {
        this.editor = editor;

        (this.frame as any).width = this.editor.output.visuals.width;
        (this.frame as any).height = this.editor.output.visuals.height;
    }
    dispose() {
        this.subscriptions.dispose();
    }
    get toolbar() {
        return (this.frame as any).shadowRoot.querySelector('kc-workspace-toolbar');
    }
    get outputViewRoot() {
        return this.frame;
    }
}

export default DefaultWorkspaceViewProvider;
