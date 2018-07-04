import { DialogProvider } from '../../editor/dialogs/dialog-provider.js';
import '../../../elements/kano-part-editor/kano-part-editor.js';

export class EditPartDialogProvider extends DialogProvider {
    constructor(editor) {
        super();
        this.editor = editor;
        this._onUpdate = this._onUpdate.bind(this);
        this.form = document.createElement('kano-part-editor');
        this.form.className = 'no-padding';
        this.form.style.margin = '0';
        this.form.addEventListener('update', this._onUpdate);
    }
    setSelected(part) {
        this.form.selected = part;
    }
    createDom() {
        return this.form;
    }
    _onUpdate(e) {
        this.emit('update', e.detail);
    }
    getName() {
        return this.form.name;
    }
    stop() {
        this.form.stop();
    }
    get fitInto() {
        return this.editor.sourceEditor;
    }
    get overlayInto() {
        return this.editor.sourceEditor;
    }
}

export default EditPartDialogProvider;
