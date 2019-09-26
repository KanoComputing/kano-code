import '@kano/styles/typography.js';
import '@kano/styles/color.js';
import 'marked/lib/marked.js';
import 'twemoji-min/2/twemoji.min.js';
import { KanoTooltip, CaretType } from '../../elements/kano-tooltip/kano-tooltip.js';
import { html, render } from 'lit-html/lit-html.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { IEditorWidget } from '../editor/widget/widget.js';

export class Tooltip implements IEditorWidget {
    protected domNode : KanoTooltip|null = null;
    protected markedEl : HTMLElement|null = null;
    protected contentNode : HTMLElement|null = null;
    render(markdown : string) {
        return html`
            <style>
                .markdown-html {
                    padding: 0px 16px;
                    max-width: 260px;
                    text-align: left;
                    line-height: 1.2;
                    color: var(--color-black);
                }
            </style>
            <div class="markdown-html">${unsafeHTML(markdown)}</div>
        `;
    }
    update(markdown : string) {
        const tpl = this.render(markdown);
        render(tpl, this.getDomNode());
    }
    getDomNode() {
        if (!this.domNode) {
            this.domNode = document.createElement('kano-tooltip') as KanoTooltip;
            this.domNode.caret = 'start';
            this.domNode.style.setProperty('--kano-tooltip-border-color', 'var(--color-abbey)');
            this.domNode.style.color = 'black';
            this.domNode.style.fontFamily = 'var(--font-body)';
            this.domNode.style.fontWeight = 'normal';
        }
        return this.domNode;
    }
    getTextNode() {
        return this.getDomNode().getElementsByClassName('markdown-html')[0].getElementsByTagName('p')[0]
    }
    setCaret(caret : CaretType) {
        const domNode = this.getDomNode();
        domNode.caret = caret;
    }
    setText(text : string) {
        const emojiReady = window.twemoji.parse(text);
        this.update(window.marked(emojiReady));
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
        domNode.updatePosition(false);
        // TODO: This is to make sure all tooltips appear over dialogs.
        // The editor should have a stacking order manager to handle all this
        domNode.style.zIndex = '200000';
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
