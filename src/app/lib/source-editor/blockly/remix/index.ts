import { RemixFloatingMenu } from './widget/floating-menu.js';
import { registerRemix, IRemix, Remix } from '../../../remix/index.js';
import { Confirm } from '../../../editor/dialogs/confirm.js';

export class BlocklyRemix extends Remix {
    resetConfirm? : Confirm;
    menu? : RemixFloatingMenu;
    data? : IRemix;
    getResetConfirm() {
        if (!this.resetConfirm) {
            this.resetConfirm = this.editor.dialogs.registerConfirm({
                buttonLabel: 'Confirm',
                heading: 'Are you sure you want to reset your remix?',
                text: 'You will loose all your changes',
            });
            this.resetConfirm.onDidConfirm(() => this.reset());
        }
        return this.resetConfirm;
    }
    reset() {
        if (!this.data) {
            return;
        }
        this.editor.load(this.data.app);
    }
    start() {
        super.start();
        if (!this.data) {
            return;
        }
        this.menu = new RemixFloatingMenu(this.data.title, this.data.suggestions);
        this.menu.onDidSelectSuggestion((s) => this.selectSuggestion(s));
        this.menu.onDidRequestReset(() => {
            const dialog = this.getResetConfirm();
            dialog.open();
        });
        this.menu.onDidRequestExamples(() => {
            if (!this.dialog) {
                return;
            }
            this.dialog.open();
        });
        this.menu.onDidEnd(() => this._onDidEnd.fire());
        this.editor.addContentWidget(this.menu);
    }
    deselectSuggestion() {
        super.deselectSuggestion();
        if (this.menu) {
            this.menu.deselectSuggestion();
        }
    }
    dispose() {
        super.dispose();
        if (this.resetConfirm) {
            this.resetConfirm.dispose();
        }
    }
}

registerRemix('blockly', BlocklyRemix);
