import { LitElement, customElement, html, property, css } from 'lit-element/lit-element.js';

@customElement('kc-toolbox-entry-preview')
export class KcToolboxEntryPreview extends LitElement {

    @property({ type: String })
    public name : string = '';

    @property({ type: String })
    public color : string = '';
    
    static get styles() {
        return [css`
            :host {
                width: 128px;
                display: inline-flex;
                flex-direction: row;
                align-items: center;
                background: #292f35;
                color: white;
                font-family: var(--font-body);
                font-weight: bold;
                height: 32px;
                text-align: left;
                padding: 2px 32px 3px 12px;
                box-sizing: border-box;
            }
            .color {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                box-shadow: none;
                margin: 0 8px 0 2px;
            }
        `];
    }
    render() {
        return html`
            <div class="color" style="background-color: ${this.color};"></div>
            <div>${this.name}</div>
        `;
    }
}
