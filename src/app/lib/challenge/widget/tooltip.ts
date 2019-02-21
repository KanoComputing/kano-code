import '../../../elements/kano-tooltip/kano-tooltip.js';
import '@kano/styles/typography.js';
import 'marked/lib/marked.js';
import 'twemoji-min/2/twemoji.min.js';

export class Tooltip {
    private domNode : HTMLElement|null = null;
    private markedEl : HTMLElement|null = null;
    getMarked() {
        if (!this.markedEl) {
            this.markedEl = document.createElement('div');
            this.markedEl.classList.add('markdown-html');
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
        const emojiReady = window.twemoji.parse(text);
        marked.innerHTML = window.marked(emojiReady);
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
