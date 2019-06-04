import '@kano/styles/color.js';
import { LitElement, customElement, property, css, html } from 'lit-element/lit-element.js';

@customElement('kc-string-preview')
export class KcStringPreview extends LitElement {

    @property({ type: String })
    public value : string|null = null;

    static get styles() {
        return [css`
            :host {
                display: inline-block;
                vertical-align: middle;
                border-radius: 3px;
                border: 1px solid var(--color-grey);
                height: 18px;
                min-width: 18px;
                line-height: 18px;
                text-align: center;
                padding: 0px 2px;
                box-sizing: border-box;
            }
        `];
    }
    render() {
        return html`<slot></slot>`;
    }
}
