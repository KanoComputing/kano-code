
import '@kano/styles/color.js';
import '../kc-circle-progress/kc-circle-progress.js';
import { LitElement, css, html, customElement, property } from 'lit-element/lit-element.js';
import { marked } from '../../lib/directives/marked.js';
import '../kano-blockly-block/kano-blockly-block.js';
import './kano-value-preview.js';
import { challengeStyles } from '../../lib/challenge/styles.js';
@customElement('kc-editor-banner')
export class KCEditorBanner extends LitElement {

    @property({ type: String })
    public text: string = '';

    @property({ type: Number })
    public progress: number = 0;

    @property({ type: String })
    public title = '';

    @property({ type: String })
    public hintText: string = '';

    @property({ type: Boolean })
    public hintDisplayed: boolean = false;

    static get styles() {
        return [css`
            :host {
                position: relative;
                display: flex;
                flex-direction: column;
                background: #FFFFFF;
                box-sizing: border-box;
                border-radius: 6px;
                box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
                width: 300px;
            }

            slot[name="avatar"]::slotted(*) {
                width: 56px;
                height: 56px;
                margin-bottom: 25px;
            }

            .info {
                padding: 0 12px;
            }
        
            slot[name="hint-button"]::slotted(button) {
                border-radius: 5px;
                border: none;
                font-weight: bold;
                font-family: var(--font-body);
                font-size: 16px;
                color: var(--color-kano-orange);
                cursor: pointer;
                outline: none;
                background-color: var(--color-white);
            }
            slot[name="hint-button"]::slotted(button:hover) {
                color: #D95000;
            }
            
            .content {
                flex-direction: column;
                font-family: var(--font-body);
                font-size: 16px;
                color: #22272D;
            }

            .actions {
                padding: 12px;
            }

            slot[name="actions"]::slotted(.reset) {
                float: right;
                margin-right: 8px;
            }
            
            .title {
                color: var(--color-grey);
                font-weight: bold;
                display: inline;
                flex: 1;
            }

            .markdown-html {
                padding: 12px 12px 0 12px;
            }
            .markdown-html p {
                line-height: 20px;
                margin: 0px;
            }

            [hidden] {
                display: none !important;
            }
            .block {
                display: flex;
                flex-direction: row;
                align-items: center;
                border-bottom: 1px solid var(--color-stone);
                padding: 0px 12px;
                font-family: var(--font-body);
                font-size: 16px;
            }
            .remix {
                border-top: 1px solid var(--color-stone);
            }

            .block-button {
                margin: 5px 10px 0 0;
                border-radius: 6px;
                padding: 1px;
                color: #FFFF;
                background-color: #3e4042;
                opacity: 0.5;
                border-radius: 15px;
                padding: 3px 12px;
                font-weight: bold;
                font-family: var(--font-body);
                font-size: 16px;
                cursor: pointer;
            }
            .block-button:focus {
                outline: none;
            }
            .block.block-1 {
                height: 32px;
                border-radius: 6px 6px 0 0;
                background-color: var(--button-action-background);
            }
            .hint {
                margin: 5px;
                border-radius: 5px;
                font-weight: bold;
                background-color: var(--color-stone);
                border-top: 1px solid var(--color-stone);
                padding: 5px 10px;
            }
        `, challengeStyles];
    }
    renderHint() {
        if (!this.hintText.length || !this.hintDisplayed) return;
        return html`<div class="hint">${marked(this.hintText)}</div>`;
    }

    render() {
        return html`
        <div class="block block-1">
            <slot name="avatar"></slot>
            <div class="title">${this.title}
            <slot name="hint-button"></slot>
        </div>
        </div>
        <div class="content">
            <div class="markdown-html" id="markdown-html">
                ${marked(this.text)}
            </div>
            <div class="info">
                <slot name="info"></slot>
            </div>
            <slot name="content"></slot>
            ${this.renderHint()}
            <div class="actions">
                <slot name="actions"></slot>
            </div>
        </div>
`;
    }
}
