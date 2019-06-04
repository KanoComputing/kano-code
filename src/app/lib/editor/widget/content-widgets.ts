import { Editor } from '../editor.js';
import { IEditorWidget } from './widget.js';

export class ContentWidgets {
    private readonly domNode : HTMLElement;
    private readonly editor : Editor;
    private widgets : IEditorWidget[] = [];
    private widgetLayerRect : DOMRect|ClientRect|null = null;
    constructor(editor : Editor, domNode : HTMLElement) {
        this.domNode = domNode;
        this.editor = editor;
        this.editor.onDidLayoutChange(() => {
            // Read the width of the activity bar to offset the widget layer correctly
            // Done as a hack as the activity bar is on its way to be deprecated
            const barRect = (this.editor.activityBar as any)._barContainer.getBoundingClientRect();
            this.domNode.style.left = `${barRect.width}px`;
            this.widgetLayerRect = null;
            this.widgets.forEach((widget) => {
                this.layoutWidget(widget);
            });
        });
    }
    getWidgetLayerRect() {
        if (!this.widgetLayerRect) {
            this.widgetLayerRect = this.domNode.getBoundingClientRect();
        }
        return this.widgetLayerRect;
    }
    addWidget(widget : IEditorWidget) {
        const domNode = widget.getDomNode();
        domNode.style.position = 'absolute';
        this.widgets.push(widget);
        this.domNode.appendChild(domNode);
        this.layoutWidget(widget);
    }
    layoutWidget(widget : IEditorWidget) {
        const position = widget.getPosition();
        if (position === null) {
            if (typeof widget.layout === 'function') {
                widget.layout(this.editor);
            }
            return;
        }
        const parentRect = this.getWidgetLayerRect();
        const p = this.editor.queryPosition(position);
        const domNode = widget.getDomNode();
        if (!p) {
            domNode.style.display = 'none';
            return;
        }
        domNode.style.display = 'block';
        domNode.style.transform = `translate(${p.x - parentRect.left}px, ${p.y - parentRect.top}px)`;
        // TODO: This is a hack to display widgets over dialogs.
        // Implement a dialog tracker in the dialogs module and use it to query the highest z-index
        // This value is to make sure they appear on top of Blockly's widget div
        domNode.style.zIndex = '200000';
    }
    removeWidget(widget : IEditorWidget) {
        this.domNode.removeChild(widget.getDomNode());
        const idx = this.widgets.indexOf(widget);
        this.widgets.splice(idx, 1);
    }
}