import { Plugin } from '../plugin.js';
import { Alert, IDialogAlertOptions } from './alert.js';
import { Confirm, IDialogConfirmOptions } from './confirm.js';
import { Dialog } from './dialog.js';
import Editor from '../editor.js';
import DialogProvider from './dialog-provider.js';
import { EventEmitter } from '@kano/common/index.js';

export class Dialogs extends Plugin {
    private editor? : Editor;
    private _onDidLayout = new EventEmitter();

    get onDidLayout() { return this._onDidLayout.event; }

    onInstall(editor : Editor) {
        this.editor = editor;
    }
    registerAlert(opts : IDialogAlertOptions) {
        const alert = new Alert(opts);
        alert.onDidOpen(() => this._onDidLayout.fire());
        this.editor!.root!.appendChild(alert.root);
        return alert;
    }
    registerConfirm(opts :IDialogConfirmOptions) {
        const confirm = new Confirm(opts);
        confirm.onDidOpen(() => this._onDidLayout.fire());
        this.editor!.root!.appendChild(confirm.root);
        return confirm;
    }
    registerDialog(provider : DialogProvider) {
        const dialog = new Dialog(provider);
        dialog.onDidOpen(() => this._onDidLayout.fire());
        this.editor!.root!.appendChild(dialog.root);
        return dialog;
    }
    dispose() {
        this._onDidLayout.dispose();
    }
}

export default Dialogs;
