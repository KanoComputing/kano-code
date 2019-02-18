import { Editor } from '../editor.js';
import { IEditorWidget } from './widget.js';

export class ContentWidgets {
    private readonly domNode : HTMLElement;
    private readonly editor : Editor;
    private widgets : IEditorWidget[] = [];
    constructor(editor : Editor, domNode : HTMLElement) {
        this.domNode = domNode;
        this.editor = editor;
        this.editor.onDidLayoutChange(() => {
            this.widgets.forEach((widget) => {
                this.layoutWidget(widget);
            });
        });
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
            return;
        }
        const p = this.editor.queryPosition(position);
        const domNode = widget.getDomNode();
        if (!p) {
            domNode.style.display = 'none';
            return;
        }
        domNode.style.display = 'block';
        domNode.style.transform = `translate(${p.x}px, ${p.y}px)`;
        // TODO: This is a hack to display widgets over dialogs. Implement a dialog tracker in the dialogs module and use it to query the highest z-index
        domNode.style.zIndex = '200';
    }
    removeWidget(widget : IEditorWidget) {
        this.domNode.removeChild(widget.getDomNode());
        const idx = this.widgets.indexOf(widget);
        this.widgets.splice(idx, 1);
    }
}