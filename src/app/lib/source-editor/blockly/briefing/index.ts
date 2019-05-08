import { Briefing } from '../../../briefing/briefing.js';
import { registerBriefing } from '../../../briefing/index.js';
import { BriefingFloatingMenu } from './widget/floating-menu.js';
import { Confirm } from '../../../editor/dialogs/confirm.js';

export class BlocklyBriefing extends Briefing {
    resetConfirm? : Confirm;
    menu? : BriefingFloatingMenu;
    getResetConfirm() {
        if (!this.resetConfirm) {
            this.resetConfirm = this.editor.dialogs.registerConfirm({
                buttonLabel: 'Confirm',
                heading: 'Are you sure you want to reset your briefing?',
                text: 'You will loose all your changes',
            });
            this.resetConfirm.onDidConfirm(() => this.reset());
        }
        return this.resetConfirm;
    }
    reset() {
        this.editor.reset();
    }
    start() {
        super.start();
        if (!this.data) {
            return;
        }
        this.menu = new BriefingFloatingMenu(this.data.instruction || '');
        this.menu.onDidRequestReset(() => {
            const dialog = this.getResetConfirm();
            dialog.open();
        });
        this.menu.onDidEnd(() => this._onDidEnd.fire());
        this.editor.addContentWidget(this.menu);
    }
    dispose() {
        super.dispose();
        if (this.menu) {
            this.editor.removeContentWidget(this.menu);
            this.menu.dispose();
        }
    }
}

registerBriefing('blockly', BlocklyBriefing);
