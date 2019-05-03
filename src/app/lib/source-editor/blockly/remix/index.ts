import { Remix } from '../../../remix/remix.js';
import { SuggestionsWidget } from './widget/list.js';
import { registerRemix } from '../../../remix/index.js';
import { Confirm } from '../../../editor/dialogs/confirm.js';

export class BlocklyRemix extends Remix {
    resetConfirm? : Confirm;
    banner? : SuggestionsWidget;
    getResetConfirm() {
        if (!this.resetConfirm) {
            this.resetConfirm = this.editor.dialogs.registerConfirm({
                buttonLabel: 'Confirm',
                heading: 'Are you sure you want to reset your remix?',
                text: 'You will loose all your changes',
            });
            this.resetConfirm.onDidConfirm(() => {
                // A bug in the loading method does not make this work. Restting before that helps
                this.editor.reset();
                this.editor.load(this.remix.app);
            });
        }
        return this.resetConfirm;
    }
    start() {
        super.start();
        this.banner = new SuggestionsWidget(this.remix.title, this.remix.suggestions);
        this.banner.onDidSelectSuggestion((s) => this.selectSuggestion(s));
        this.banner.onDidRequestReset(() => {
            const dialog = this.getResetConfirm();
            dialog.open();
        });
        this.banner.onDidEnd(() => this._onDidEnd.fire());
        this.editor.addContentWidget(this.banner);
    }
    deselectSuggestion() {
        super.deselectSuggestion();
        if (this.banner) {
            this.banner.deselectSuggestion();
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
