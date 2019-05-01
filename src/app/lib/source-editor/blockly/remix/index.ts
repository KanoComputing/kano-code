import { Remix } from '../../../remix/remix.js';
import { SuggestionsWidget } from './widget/list.js';
import { registerRemix } from '../../../remix/index.js';

export class BlocklyRemix extends Remix {
    start() {
        super.start();
        const banner = new SuggestionsWidget(this.remix.title, this.remix.suggestions);
        banner.onDidSelectSuggestion((s) => this.selectSuggestion(s));
        this.editor.addContentWidget(banner);
    }
}

registerRemix('blockly', BlocklyRemix);
