import '@kano/styles/typography.js';
import 'marked/lib/marked.js';
import 'twemoji-min/2/twemoji.min.js';
import { KanoTooltip } from '../../../elements/kano-tooltip/kano-tooltip.js';

export class Tooltip {
    private domNode : KanoTooltip|null = null;
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
            this.domNode = document.createElement('kano-tooltip') as KanoTooltip;
            this.domNode.caret = 'start';
            const content = document.createElement('div');
            content.style.padding = '0px 16px';
            this.domNode.style.setProperty('--kano-tooltip-border-color', 'var(--color-black)');
            this.domNode.style.color = 'black';
            this.domNode.style.fontFamily = 'var(--font-body)';
            this.domNode.style.fontWeight = 'bold';
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
    setTarget(target : HTMLElement) {
        const domNode = this.getDomNode() as any;
        domNode.target = target;
    }
    layout() {
        const domNode = this.getDomNode() as any;
        domNode.updatePosition();
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
