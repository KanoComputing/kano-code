import { Editor } from '../editor/editor.js';
import { Tooltip } from '../challenge/widget/tooltip.js';
import { EventEmitter } from '@kano/common/index.js';

export interface IRemixSuggestion {
    title : string;
    target : string;
    content : string;
}

export interface IRemix {
    id : string;
    title : string;
    app : any;
    suggestions : IRemixSuggestion[];
}

export class Remix {
    protected editor : Editor;
    protected remix : IRemix;
    protected tooltip? : Tooltip;

    protected _onDidEnd = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }

    constructor(editor : Editor, remix : IRemix) {
        this.editor = editor;
        this.remix = remix;
    }
    start() {
        this.editor.load(this.remix.app);
    }
    selectSuggestion(suggestion : IRemixSuggestion) {
        if (this.tooltip) {
            this.editor.removeContentWidget(this.tooltip);
            this.tooltip.dispose();
        }
        this.tooltip = new Tooltip();
        const target = this.editor.queryElement(suggestion.target);
        this.tooltip.setText(suggestion.content);
        this.tooltip.setPosition('bottom');
        this.tooltip.setOffset(0);
        this.editor.addContentWidget(this.tooltip);
        this.tooltip.setTarget(target as HTMLElement);
    }
    dispose() {}
}
