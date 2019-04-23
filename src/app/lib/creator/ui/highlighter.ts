export class Highlighter {
    domNode? : HTMLElement;
    parent : HTMLElement;
    constructor(parent? : HTMLElement) {
        this.parent = parent || document.body;
    }
    getDomNode() {
        if (!this.domNode) {
            this.domNode = document.createElement('div');
            this.domNode.style.position = 'fixed';
            this.domNode.style.background = 'rgba(0, 0, 0, 0.5)';
        }
        return this.domNode;
    }
    highlight(targetEl : HTMLElement|SVGElement) {
        const rect = targetEl.getBoundingClientRect();
        const node = this.getDomNode();
        this.parent.appendChild(node);
        node.style.top = `${rect.top}px`;
        node.style.left = `${rect.left}px`;
        node.style.width = `${rect.width}px`;
        node.style.height = `${rect.height}px`;
        node.style.display = 'block';
    }
    clear() {
        const node = this.getDomNode();
        node.style.display = 'none';
    }
    dispose() {
        if (this.domNode && this.domNode.parentNode) {
            this.domNode.parentNode.removeChild(this.domNode);
        }
    }
}