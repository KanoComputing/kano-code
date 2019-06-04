import Editor from '../editor/editor.js';
import { IEditorWidget } from '../editor/widget/widget.js';
import { BlocklySourceEditor } from '../source-editor/blockly.js';

export interface IBannerData {
    text : string;
    nextButton : boolean;
}

export class BlocklyEditorBannerWidget implements IEditorWidget {
    private domNode? : HTMLElement;
    getDomNode() {
        if (!this.domNode) {
            this.domNode = document.createElement('div');
            this.domNode.style.padding = '16px';
            this.domNode.style.display = 'flex';
            this.domNode.style.flexDirection = 'column';
            this.domNode.style.alignItems = 'center';
            this.domNode.style.boxSizing = 'border-box';
            this.domNode.style.pointerEvents = 'none';
        }
        return this.domNode;
    }
    getPosition() {
        return null;
    }
    getWorkspace(editor : Editor) {
        return (editor.sourceEditor as BlocklySourceEditor).getWorkspace();
    }
    layout(editor : Editor) {
        if (editor.sourceType !== 'blockly') {
            return;
        }
        const domNode = this.getDomNode();
        const workspace = this.getWorkspace(editor);
        const metrics = workspace.getMetrics();
        const flyout = workspace.getFlyout_();
        let width = workspace.toolbox_ && !workspace.toolbox_.opened ? metrics.toolboxWidth : flyout.getWidth() + 35;
        const bannerWidth = (metrics.viewWidth + metrics.toolboxWidth) - width;
        if (editor.activityBar.entries.length) {
            width += 48;
        }
        domNode.style.left = `${width}px`;
        domNode.style.top = '0px';
        domNode.style.width = `${bannerWidth}px`;
        domNode.style.maxWidth = `${bannerWidth}px`;
    }
    dispose() {}
}