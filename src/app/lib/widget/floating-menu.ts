import '@kano/styles/typography.js';
import { LitElement, customElement, html, property, css } from 'lit-element/lit-element.js';
import { BlocklyEditorBannerWidget } from './blockly-banner.js';
import { templateContent } from '../directives/template-content.js';
import { button } from '@kano/styles/button.js';

@customElement('kc-floating-menu')
export class KCFloatingMenu extends LitElement {

    @property({ type: String })
    title : string = ''

    @property({ type: String })
    header : string = ''

    static get styles() {
        return [css`
            :host {
                overflow: hidden;
                display: flex;
                flex-direction: column;
                font-family: var(--font-body);
                background: white;
                border-radius: 6px;
                box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
                color: var(--color-black);
                max-width: 280px;
                align-self: flex-end;
            }
            .content {
                display: flex;
                flex-direction: column;
                padding: 8px 24px;
            }
            .title {
                background: var(--color-grey);
                color: white;
                padding: 4px 16px;
                font-size: 18px;
                font-weight: bold;
            }
            .header {
                font-size: 18px;
                font-weight: bold;
                padding: 8px 24px;
            }
            .actions {
                padding: 8px 24px 24px;
            }
        `];
    }

    render() {
        return html`
            ${templateContent(button)}
            <div class="title">${this.title}</div>
            <div class="header">${this.header}</div>
            <div class="content">${this.renderContent()}</div>
            <div class="actions">${this.renderActions()}</div>
        `;
    }
    renderContent() {}
    renderActions() {}
}

export class FloatingMenu extends BlocklyEditorBannerWidget {
    protected title : string;
    protected header : string;
    protected menuNode? : KCFloatingMenu;

    constructor(title: string, header : string) {
        super();
        this.title = title;
        this.header = header;
    }

    getMenuNode() {
        if (!this.menuNode) {
            this.menuNode = new KCFloatingMenu();
            this.menuNode.title = this.title;
            this.menuNode.header = this.header;
        }
        return this.menuNode;
    }

    getDomNode() {
        const domNode = super.getDomNode();
        const menuNode = this.getMenuNode();
        domNode.appendChild(menuNode);
        return domNode;
    }
}