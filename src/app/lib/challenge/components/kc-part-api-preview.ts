import { LitElement, customElement, html, property, css } from 'lit-element/lit-element.js';

@customElement('kc-part-api-preview')
export class KcPartApiPreview extends LitElement {

    @property({ type: String })
    public label : string = '';
    
    @property({ type: String })
    public icon : string = '';
    
    static get styles() {
        return [css`
            :host {
                display: inline-flex;
                flex-direction: row;
                align-items: center;
                vertical-align: middle;
            }
            img {
                width: 24px;
                height: 24px;
            }
        `];
    }
    render() {
        return html`
            <img .src=${this.icon} />
            <div>${this.label}</div>
        `;
    }
}
