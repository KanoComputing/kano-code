import { LitElement, customElement, html, css } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import '@kano/styles/typography.js';
import { closure } from '@kano/styles/closure.js';
import { templateContent } from '../../directives/template-content.js';
import { IPartAPI } from '../api.js';
import { property } from '../decorators.js';
import './kc-add-part-item.js';
import { create } from './icons.js';
import { _ } from '../../i18n/index.js';

@customElement('kc-add-part')
export class KCAddPart extends LitElement {
    @property({ type: Array, value: () => [] })
    public parts : IPartAPI[] = [];
    @property({ type: Array, value: null })
    public whitelist : string[]|null = null;
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
                width: 800px;
                max-width: 100%;
                border-radius: 5px;
                border: 2px solid var(--kano-app-part-editor-border);
                max-height: 100vh;       
            }
            header {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-shrink: 0;
                height: 48px;
                padding: 0 16px;
                border-bottom: 2px solid var(--kano-app-part-editor-border);
            }
            .label {
                flex: 1;
                flex-basis: 0.000000001px;
                font-size: 16px;
                font-weight: bold;
            }
            .label-text {
                padding-left: 4px;
            }
            .parts {
                padding: 32px 40px;
                columns: 3;
                column-gap: 24px;
            }
            kc-add-part-item {
                margin-bottom: 8px;
                break-inside: avoid;
            }
            kc-add-part-item svg {
                width: 24px !important;
                height: 24px !important;
            }
        `;
    }
    render() {
        return html`
            ${templateContent(closure)}
            <header>
                <div class="label">
                    ${templateContent(create)} 
                    <span class="label-text">${_('ADD_PARTS_HEADING', 'Add Parts')}</span>
                </div>
                <button class="closure secondary" dialog-dismiss></button>
            </header>
            <div class="parts">
                ${this.getFilteredParts().map((part) => html`
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
    getFilteredParts() {
        if (!this.whitelist) {
            return this.parts;
        }
        return this.parts.filter(p => this.whitelist!.indexOf(p.type) !== -1);
    }
    _onClick(part : IPartAPI) {
        this.dispatchEvent(new CustomEvent('part-click', { detail: part, bubbles: true, composed: true }));
    }
}