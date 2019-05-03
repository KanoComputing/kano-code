import { RemixTooltip } from './widget/tooltip.js';
import { Briefing, IBriefingData } from '../briefing/briefing.js';

export interface IRemixSuggestion {
    title : string;
    target : string;
    content : string;
}

export interface IRemix extends IBriefingData {
    title : string;
    app : any;
    suggestions : IRemixSuggestion[];
}

export class Remix extends Briefing {
    protected data? : IRemix;
    protected tooltip : RemixTooltip|null = null;
    start() {
        super.start();
        if (!this.dialog) {
            return;
        }
        const dialogSub = this.dialog.onDidClose(() => {
            dialogSub.dispose();
            if (!this.data) {
                return;
            }
            this.editor.load(this.data.app);
            this.onDialogClosed();
        });
    }
    onDialogClosed() {}
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
