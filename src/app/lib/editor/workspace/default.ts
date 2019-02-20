import { Disposables, subscribeDOM } from '@kano/common/index.js';
import { WorkspaceViewProvider } from './index.js';
import '../../../elements/kc-workspace-frame/kc-workspace-frame.js';
import '../../../elements/kc-workspace-frame/kc-parts-controls.js';
import Editor from '../editor.js';
import { KCPartsControls } from '../../../elements/kc-workspace-frame/kc-parts-controls.js';

const DEFAULT_SOURCE = `<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="app_onStart" id="default_app_onStart" x="118" y="91"><field name="FLASH"></field></block></xml>`;

export class DefaultWorkspaceViewProvider extends WorkspaceViewProvider {
    private subscriptions : Disposables = new Disposables();
    public root : HTMLElement = document.createElement('div');
    private frame : HTMLElement = document.createElement('kc-workspace-frame');
    public partsControls : KCPartsControls = document.createElement('kc-parts-controls') as KCPartsControls;
    public source : string = DEFAULT_SOURCE;
    constructor(editor : Editor) {
        super(editor);
        this.root = document.createElement('div');
        this.frame.style.margin = '0 40px';
        this.partsControls.setAttribute('slot', 'controls');

        this.editor.output.onDidFullscreenChange(() => {
            (this.frame as any).fullscreen = this.editor.output.getFullscreen();
        });

        subscribeDOM(this.frame, 'viewport-resize', () => {
            if (this.editor.output.outputView) {
                this.editor.output.outputView.resize();
            }
        });
        subscribeDOM(this.frame, 'close-fullscreen', () => {
            this.editor.output.setFullscreen(false)
        });

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
