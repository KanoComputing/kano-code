import { LitElement, customElement, property, css, html } from 'lit-element/lit-element.js';
import '@kano/styles/color.js';

@customElement('kc-add-part-item')
export class KCAddPartItem extends LitElement {
    @property({ type: String })
    public label: string = '';

    @property({ type: String })
    public fill: string = '#8F9195';

    @property({ type: String })
    public disabled: boolean = false;

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                cursor: pointer;
                color: white;
                overflow: hidden;
                justify-content: center;
                height: 40px;
                background-color: var(--color-chateau);
                border-radius: 3px;
            }
            :host([disabled]) {
                opacity: 0.4;
                cursor: default;
            }
            #label {
                color: white;
            }
            button.body {
                display: flex;
                flex-direction: row;
                align-items: center;
                background: inherit;
                color: inherit;
                padding: 0;
                border: 0px;
                font-size: 14px;
                font-family: var(--font-body);
                cursor: pointer;
                outline: none;
            }
            button[disabled] {
                cursor: default;
            }
            #content {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex: 1;
                flex-basis: 0.000000001px;
            }
            .icon::slotted(* svg) {
                /* terminal has width and height defined as 100%. This is a workaround to get proper rendering */
                width: 24px !important;
                height: 24px !important;
                fill: #8F9195;
                margin: 8px 12px 8px 8px;
            }
            :host(:hover) .icon::slotted(*) {
                fill: var(--kc-add-part-item-hover-color);
            }
            :host(:hover:not([disabled])) {
                background-color: #5b646b;
            }
            [hidden] {
                display: none !important;
            }
        `;
    }
    render() {
        return html`
            <button type="button" class="body" ?disabled=${this.disabled}>
                <div id="content">
                    <slot class="icon" id="part-icon"></slot>
                    <div id="label">${this.label}</div>
                </div>
            </button>
        `;
    }
}