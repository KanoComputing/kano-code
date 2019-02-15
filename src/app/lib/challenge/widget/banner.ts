import Editor from '../../editor/editor.js';
import { KCEditorBanner } from '../../../elements/kano-editor-banner/kano-editor-banner.js';
import { IEditorWidget } from '../../editor/widget/widget.js';
import { BlocklySourceEditor } from '../../editor/source-editor/blockly.js';
import { Blockly } from '@kano/kwc-blockly/blockly.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import 'twemoji-min/2/twemoji.min.js';

declare global {
    interface Window {
        twemoji : {
            parse(input : string) : string;
        };
    }
}

export interface IBannerData {
    text : string;
    nextButton : boolean;
}

export class BannerWidget implements IEditorWidget {
    private editor : Editor;
    private domNode? : HTMLElement;
    private bannerEl? : KCEditorBanner;
    private workspaceListener? : (e : any) => void;
    private _onDidClick : EventEmitter = new EventEmitter();
    get onDidClick() { return this._onDidClick.event; }
    constructor(editor : Editor) {
        this.editor = editor;
    }
    getDomNode() {
        if (!this.domNode) {
            this.domNode = document.createElement('div');
            this.domNode.style.padding = '16px';
            this.domNode.style.display = 'flex';
            this.domNode.style.flexDirection = 'column';
            this.domNode.style.alignItems = 'center';
            this.domNode.style.boxSizing = 'border-box';
            this.domNode.style.pointerEvents = 'none';
            this.bannerEl = new KCEditorBanner();
            this.bannerEl.style.width = '512px';
            this.bannerEl.style.maxWidth = '512px';
            this.bannerEl.style.pointerEvents = 'all';
            this.domNode.appendChild(this.bannerEl);
            subscribeDOM(this.bannerEl, 'button-clicked', () => this._onDidClick.fire());
        }
        return this.domNode;
    }
    getPosition() {
        return null;
    }
    getWorkspace() {
        return (this.editor.sourceEditor as BlocklySourceEditor).getWorkspace();
    }
    layout() {
        if (this.editor.sourceType !== 'blockly') {
            return;
        }
        const domNode = this.getDomNode();
        const workspace = this.getWorkspace();
        const metrics = workspace.getMetrics();
        const flyout = workspace.getFlyout_();
        const width = workspace.toolbox_ && !workspace.toolbox_.opened ? metrics.toolboxWidth : flyout.getWidth() + 35;
        const bannerWidth = (metrics.viewWidth + metrics.toolboxWidth) - width;
        domNode.style.left = `${width}px`;
        domNode.style.top = '0px';
        domNode.style.width = `${bannerWidth}px`;
        domNode.style.maxWidth = `${bannerWidth}px`;
    }
    show() {
        const workspace = this.getWorkspace();
        this.editor.addContentWidget(this);
        this.workspaceListener = workspace.addChangeListener((e : any) => {
            if ([Blockly.Events.OPEN_FLYOUT, Blockly.Events.CLOSE_FLYOUT].indexOf(e.type) === -1) {
                return;
            }
            setTimeout(() => {
                this.layout();
            });
        });
        this.layout();
    }
    hide() {
        const workspace = this.getWorkspace();
        workspace.removeChangeListener(this.workspaceListener!);
        this.editor.removeContentWidget(this);
    }
    setData(data : IBannerData) {
        if (!this.bannerEl) {
            this.getDomNode();
        }
        this.bannerEl!.text = window.twemoji.parse(data.text);
        this.bannerEl!.buttonState = data.nextButton ? 'active' : 'inactive';
    }
    dispose() {
        this.hide();
        this._onDidClick.dispose();
    }
}