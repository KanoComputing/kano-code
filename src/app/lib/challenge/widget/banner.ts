import Editor from '../../editor/editor.js';
import { KCEditorBanner } from '../../../elements/kano-editor-banner/kano-editor-banner.js';
import { IEditorWidget } from '../../editor/widget/widget.js';
import { BlocklySourceEditor } from '../../editor/source-editor/blockly.js';
import { Blockly } from '@kano/kwc-blockly/blockly.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';

export interface IBannerData {
    text : string;
}

export class BannerWidget implements IEditorWidget {
    private editor : Editor;
    private domNode? : KCEditorBanner; 
    private workspaceListener? : (e : any) => void;
    private _onDidClick : EventEmitter = new EventEmitter();
    get onDidClick() { return this._onDidClick.event; }
    constructor(editor : Editor) {
        this.editor = editor;
    }
    getDomNode() {
        if (!this.domNode) {
            this.domNode = new KCEditorBanner();
            subscribeDOM(this.domNode, 'button-clicked', () => this._onDidClick.fire());
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
        const domNode = this.getDomNode();
        domNode.text = data.text;
    }
    dispose() {
        this.hide();
        this._onDidClick.dispose();
    }
}