import '../../../elements/kano-tooltip/kano-tooltip.js';
import '@polymer/marked-element/marked-element.js';
import '@kano/styles/typography.js';

export class Tooltip {
    private domNode : HTMLElement|null = null;
    private markedEl : HTMLElement|null = null;
    getMarked() {
        if (!this.markedEl) {
            this.markedEl = document.createElement('marked-element');
            const renderTarget = document.createElement('div');
            renderTarget.classList.add('markdown-html');
            renderTarget.setAttribute('slot', 'markdown-html');
            this.markedEl.appendChild(renderTarget);
        }
        return this.markedEl;
    }
    getDomNode() {
        if (!this.domNode) {
            this.domNode = document.createElement('kano-tooltip');
            const content = document.createElement('div');
            content.style.padding = '0px 16px';
            this.domNode.style.setProperty('--kano-tooltip-background-color', 'white');
            this.domNode.style.setProperty('--kano-tooltip-border-color', 'white');
            this.domNode.style.setProperty('--kano-tooltip-border-width', '1px');
            this.domNode.style.color = 'black';
            this.domNode.style.fontFamily = 'var(--font-body)';
            this.domNode.style.padding = '8px';
            content.appendChild(this.getMarked());
            this.domNode.appendChild(content);
        }
        return this.domNode;
    }
    setText(text : string) {
        const marked = this.getMarked() as any;
        marked.markdown = text;
    }
    setPosition(position : string) {
        const marked = this.getDomNode() as any;
        marked.position = position;
    }
    setOffset(offset : number) {
        const domNode = this.getDomNode() as any;
        domNode.offset = offset;
    }
    layout(target : HTMLElement) {
        const domNode = this.getDomNode() as any;
        domNode.target = target;
    }
    getPosition() {
        return null;
    }
    close() {
        const domNode = this.getDomNode() as any;
        domNode.close();
        return new Promise((resolve) => {
            setTimeout(resolve, 150);
        });
    }
    dispose() {

    }
}
