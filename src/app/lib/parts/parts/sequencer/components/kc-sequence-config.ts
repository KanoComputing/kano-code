import '@kano/kwc-blockly/input/kwc-blockly-wrapper.js';
import '@kano/styles/color.js';
import { LitElement, html, customElement, css, property } from 'lit-element/lit-element.js';

@customElement('kc-sequence-config')
export class KCSequenceConfig extends LitElement {

    @property({ type: String })
    public title : string = '';

    @property({ type: Number })
    public value : number = 8;
    
    @property({ type: Array })
    public options : number[] = [8, 16];

    static get styles() {
        return [css`
            :host {
                display: block;
            }
            kwc-blockly-wrapper {
                --kwc-blockly-wrapper-caret-color: var(--color-black);
            }
            .options {
                display: flex;
                flex-direction: row;
            }
            .option input[type="radio"] {
                opacity: 0;
                width: 0;
                margin: 0;
            }
            .option label {
                margin: 0;
                padding: 4px 8px;
                background: #464C51;
                cursor: pointer;
                width: 30px;
            }
            .content {
                padding: 16px;
            }
            .option input:checked+label {
                background: red;
            }
            .option:first-child label {
                border-top-left-radius: 3px;
                border-bottom-left-radius: 3px;
            }
            .option:last-child label {
                border-top-right-radius: 3px;
                border-bottom-right-radius: 3px;
            }
            .option:not(:first-child) label {
                border-left: 1px solid #23272C;
            }
        `];
    }
    render() {
        return html`
            <kwc-blockly-wrapper .title=${this.title} no-close-button>
                <div class="content" slot="content">
                    <div class="controls">
                        <div class="options">
                            ${this.options.map(v => this.renderInput(v))}
                        </div>
                    </div>
                </div>
            </kwc-blockly-wrapper>
        `;
    }
    renderInput(value : number) {
        return html`
            <div class="option">
                <input id=${value} type="radio" name="subdivision" .checked=${value === this.value} @change=${() => this._onChange(value)} /><!--
                --><label for=${value}>${value}</label>
            </div>
        `;
    }
    _onChange(value : number) {
        this.value = value;
        this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
    }
}
