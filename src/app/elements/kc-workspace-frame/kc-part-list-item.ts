import '@kano/styles/typography.js';
import { LitElement, css, html, property, customElement } from 'lit-element/lit-element.js';
import { templateContent } from '../../lib/directives/template-content.js';
import '../kc-validated-editable-label.js';

@customElement('kc-part-list-item')
export class KCPartListItem extends LitElement {
    @property({ type: String })
    public label : string = '';
    @property({ type: HTMLTemplateElement })
    public icon? : HTMLTemplateElement;
    @property({ type: Function })
    public validator : (oldName : string, newName : string) => boolean = () => true;
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
            <kc-validated-editable-label class$="label" .label=${this.label} .validator=${this.validator} @change=${this._onLabelChange}></kc-validated-editable-label>
            <div class="controls" id="controls"><slot></slot></div>
        `;
    }
    _onLabelChange(e : CustomEvent) {
        this.dispatchEvent(new CustomEvent('label-change', { detail: e.detail, bubbles: true, composed: true }))
    }
}

