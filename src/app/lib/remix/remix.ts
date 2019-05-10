import { RemixTooltip } from './widget/tooltip.js';
import { ChallengeBase } from '../challenge/base.js';
import Dialog from '../editor/dialogs/dialog.js';
import { RemixDialogProvider } from './dialog.js';

export interface IRemixSuggestion {
    title : string;
    target : string;
    content : string;
}

export interface IRemixSample {
    img : string;
    description : string;
}

export interface IRemix {
    title : string;
    app : any;
    suggestions : IRemixSuggestion[];
    samples : IRemixSample[];
}

export class Remix extends ChallengeBase {
    protected dialog? : Dialog;
    public data? : IRemix;
    protected tooltip : RemixTooltip|null = null;
    start() {
        if (!this.editor.injected) {
            throw new Error('Could not start remix: The editor was not injected');
        }
        if (!this.data) {
            throw new Error('Could not start challenge: No data was provided');
        }
        this.dialog = this.editor.dialogs.registerDialog(new RemixDialogProvider(this.data));
        this.dialog.open();
        this.editor.load(this.data.app);
    }
    selectSuggestion(suggestion : IRemixSuggestion) {
        if (this.tooltip) {
            this.editor.removeContentWidget(this.tooltip);
            this.tooltip.dispose();
        }
        this.tooltip = new RemixTooltip();
        const target = this.editor.queryElement(suggestion.target);
        this.tooltip.setText(suggestion.content);
        this.tooltip.setPosition('bottom');
        this.tooltip.setOffset(0);
        this.tooltip.onDidDismiss(() => {
            this.deselectSuggestion();
        });
        this.editor.addContentWidget(this.tooltip);
        this.tooltip.setTarget(target as HTMLElement);
    }
    deselectSuggestion() {
        if (this.tooltip) {
            this.tooltip.close()
                .then(() => {
                    this.tooltip!.dispose();
                    this.tooltip = null;
                });
        }
    }
    dispose() {}
}
