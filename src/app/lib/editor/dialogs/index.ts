import { Plugin } from '../plugin.js';
import { Alert, IDialogAlertOptions } from './alert.js';
import { Confirm, IDialogConfirmOptions } from './confirm.js';
import { Dialog } from './dialog.js';
import Editor from '../editor.js';
import DialogProvider from './dialog-provider.js';

export class Dialogs extends Plugin {
    private editor? : Editor;
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    registerAlert(opts : IDialogAlertOptions) {
        const alert = new Alert(opts);
        this.editor!.root!.appendChild(alert.root);
        return alert;
    }
    registerConfirm(opts :IDialogConfirmOptions) {
        const confirm = new Confirm(opts);
        this.editor!.root!.appendChild(confirm.root);
        return confirm;
    }
    registerDialog(provider : DialogProvider) {
        const dialog = new Dialog(provider);
        this.editor!.root!.appendChild(dialog.root);
        return dialog;
    }
}

export default Dialogs;
