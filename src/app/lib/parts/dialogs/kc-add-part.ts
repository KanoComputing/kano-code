import { LitElement, customElement, html, css } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import '@kano/styles/typography.js';
import { button } from '@kano/styles/button.js';
import { templateContent } from '../../directives/template-content.js';
import { IPartAPI } from '../api.js';
import { property } from '../decorators.js';
import './kc-add-part-item.js';

@customElement('kc-add-part')
export class KCAddPart extends LitElement {
    @property({ type: Array, value: () => [] })
    public parts : IPartAPI[] = [];
    static get styles() {
        return css`
            :host {
                margin: 0 !important;
                padding: 0 !important;
                display: flex;
                flex-direction: column;
                color: white;
                background-color: var(--kano-app-editor-workspace-background);
                font-family: var(--font-body);
                min-width: 240px;
            }
            header {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-shrink: 0;
                height: 58px;
                padding: 0 16px;
                border-bottom: 2px solid #252A30;
            }
            header .label {
                flex: 1;
                flex-basis: 0.000000001px;
                font-size: 16px;
                font-weight: bold;
            }
            .parts {
                padding: 16px;
            }
            kc-add-part-item {
                margin-bottom: 8px;
            }
        `;
    }
    render() {
        return html`
            ${templateContent(button)}
            <header>
                <div class="label">Add Parts</div>
                <button type="button" class="btn secondary" dialog-dismiss>Done</button>
            </header>
            <div class="parts">
                ${this.parts.map((part) => html`
                    <kc-add-part-item
                        id=${part.type}
                        .label=${part.label}
                        style=${styleMap({ '--kc-add-part-item-hover-color': part.color })}
                        @click=${() => this._onClick(part)}>${templateContent(part.icon)}</kc-add-part-item>
                `)}
            </div>
        `;
    }
    getPartElement(type : string) {
        return this.renderRoot!.querySelector(`#${type}`);
    }
    _onClick(part : IPartAPI) {
        this.dispatchEvent(new CustomEvent('part-click', { detail: part, bubbles: true, composed: true }));
    }
}