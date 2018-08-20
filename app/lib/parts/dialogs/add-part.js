import { DialogProvider } from '../../editor/dialogs/dialog-provider.js';
import '../components/kano-add-parts/kano-add-parts.js';

export class AddPartDialogProvider extends DialogProvider {
    constructor(editor) {
        super();
        this.editor = editor;
        this._onConfirm = this._onConfirm.bind(this);
        this._elementsChanged = this._elementsChanged.bind(this);
        this.form = document.createElement('kano-add-parts');
        this.form.className = 'no-padding';
        this.form.style.margin = '0';
        this.form.addEventListener('confirm', this._onConfirm);
        this.form.addEventListener('elements-changed', this._elementsChanged);
        this.editor.registerLegacyElement('parts-panel', this.form);
    }
    setParts(parts) {
        this.form.availableParts = parts;
    }
    setUsedParts(usedParts) {
        this.form.usedParts = [];
        this.form.usedParts = usedParts;
    }
    createDom() {
        return this.form;
    }
    _onConfirm(e) {
        this.emit('confirm', e.detail);
    }
    _elementsChanged(e) {
        const elements = e.detail;
        elements.forEach((el) => {
            const id = el.getAttribute('id');
            this.editor.registerLegacyElement(`parts-panel-${id}`, el);
        });
    }
}

export default AddPartDialogProvider;
