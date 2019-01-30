import { Plugin } from '../plugin.js';
import { Alert } from './alert.js';
import { Confirm } from './confirm.js';
import { Dialog } from './dialog.js';

export class Dialogs extends Plugin {
    onInstall(editor) {
        this.editor = editor;
    }
    registerAlert(opts = {}) {
        const alert = new Alert(opts);
        this.editor.root.appendChild(alert.root);
        return alert;
    }
    registerConfirm(opts = {}) {
        const confirm = new Confirm(opts);
        this.editor.root.appendChild(confirm.root);
        return confirm;
    }
    registerDialog(provider) {
        const dialog = new Dialog(provider);
        this.editor.root.appendChild(dialog.root);
        return dialog;
    }
}

export default Dialogs;
