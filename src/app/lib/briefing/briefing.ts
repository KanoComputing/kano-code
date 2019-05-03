import { Dialog } from '../editor/dialogs/dialog.js';
import { BriefingDialogProvider } from './dialog.js';
import { ChallengeBase } from '../challenge/base.js';

export interface IBriefingSample {
    img : string;
    description : string;
}

export interface IBriefingData {
    id : string;
    samples : IBriefingSample[];
    instruction? : string;
}

export class Briefing extends ChallengeBase {
    protected data? : IBriefingData;
    protected dialog? : Dialog;
    start() {
        if (!this.editor.injected) {
            throw new Error('Could not start briefing: The editor was not injected');
        }
        if (!this.data) {
            throw new Error('Could not start challenge: No data was provided');
        }
        this.dialog = this.editor.dialogs.registerDialog(new BriefingDialogProvider(this.data));
        this.dialog.open();
    }
    dispose() {
        if (this.dialog) {
            this.dialog.dispose();
        }
    }
}
