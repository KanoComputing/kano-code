import { Briefing } from '../../../briefing/briefing.js';
import { registerBriefing } from '../../../briefing/index.js';
import { BannerWidget } from '../../../challenge/widget/banner.js';

export class BlocklyBriefing extends Briefing {
    start() {
        super.start();
        if (!this.dialog) {
            return;
        }
        this.dialog.onDidClose(() => {
            const banner = new BannerWidget();
            banner.setText(this.data.instruction);
            this.editor.addContentWidget(banner);
            banner.show();
        });
    }
}

registerBriefing('blockly', BlocklyBriefing);
