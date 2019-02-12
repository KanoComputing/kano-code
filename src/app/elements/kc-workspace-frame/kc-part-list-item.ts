import '@kano/styles/typography.js';
import { LitElement, css, html, property, customElement } from 'lit-element/lit-element.js';
import { templateContent } from '../../lib/directives/template-content.js';
import '../kc-editable-label.js';

@customElement('kc-part-list-item')
export class KCPartListItem extends LitElement {
    @property({ type: String })
    public label : string = '';
    @property({ type: HTMLTemplateElement })
    public icon? : HTMLTemplateElement;
    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: row;
                align-items: center;
                color: #fff;
                font-size: 14px;
                white-space: nowrap;
                font-family: var(--font-body);
            }
            :host(:hover) .icon {
                fill: var(--kano-part-list-item-highlight-color);
            }
            .icon {
                fill: #8F9195;
                width: 24px;
                height: 24px;
                margin: 8px 12px 8px 0;
                flex-shrink: 0;
            }
            .label {
                min-width: 60px;
            }
            .controls {
                flex: 1 1 auto;
                margin-left: 8px;
            }
            .edit-icon {
                display: none;
            }
        `;
    }
    render() {
        return html`
            <div id="icon" class="icon">${this.icon ? templateContent(this.icon) : ''}</div>
            <kc-editable-label class$="label" .label=${this.label}></kc-editable-label>
            <div class="controls" id="controls"><slot></slot></div>
        `;
    }
}

