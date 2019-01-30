import { Plugin } from '../../lib/editor/plugin.js';
import { DialogProvider } from '../../lib/editor/dialogs/dialog-provider.js';
import './components/kano-background-editor.js';

class BackgroundDialogProvider extends DialogProvider {
    constructor(editor) {
        super();
        this.editor = editor;
        this._onValueChanged = this._onValueChanged.bind(this);
        this.form = document.createElement('kano-background-editor');
        this.form.className = 'no-padding';
        this.form.style.margin = '0';
        this.form.addEventListener('value-changed', this._onValueChanged);
    }
    createDom() {
        return this.form;
    }
    get fitInto() {
        return this.editor.sourceEditor;
    }
    get overlayInto() {
        return this.editor.sourceEditor;
    }
    setBackground(background) {
        this.form.value = background;
    }
    _onValueChanged(e) {
        const background = e.detail.value;
        this.emit('background-changed', background);
    }
}

export class BackgroundEditorPlugin extends Plugin {
    constructor(outputPlugin) {
        super();
        this.outputPlugin = outputPlugin;
        this._onClick = this._onClick.bind(this);
    }
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        this.setupUI();
    }
    setupUI() {
        const { workspaceView } = this.editor;
        const root = workspaceView.root.shadowRoot || workspaceView.root;
        const container = root.querySelector('kc-parts-controls');
        if (!container) {
            return;
        }
        const dom = document.createElement('div');
        dom.setAttribute('slot', 'extra-parts');
        dom.className = 'part';
        dom.innerHTML = `
            <iron-icon icon="aspect-ratio" class="background-icon"></iron-icon>
            <div>Background</div>
        `;
        dom.addEventListener('click', this._onClick);
        container.appendChild(dom);

        this.backgroundForm = new BackgroundDialogProvider(this.editor);
        this.backgroundForm.on('background-changed', (background) => {
            this.outputPlugin.setBackground(background);
        });
        this.backgroundDialog = this.editor.dialogs.registerDialog(this.backgroundForm);
    }
    _onClick() {
        this.backgroundForm.setBackground(this.outputPlugin.background);
        this.backgroundDialog.open();
    }
    setBackground(background) {
        this._background = background;
    }
}

export default BackgroundEditorPlugin;
