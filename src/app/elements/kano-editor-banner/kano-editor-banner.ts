
import '@kano/styles/color.js';
import '../kano-circle-progress/kano-circle-progress.js';
import { LitElement, css, html, customElement, property } from 'lit-element/lit-element.js';
import { templateContent } from '../../lib/directives/template-content.js';
import { marked } from '../../lib/directives/marked.js';
import { button } from '@kano/styles/button.js';
import '../kano-blockly-block/kano-blockly-block.js';
import './kano-value-preview.js';
import { challengeStyles } from '../../lib/challenge/styles.js';

@customElement('kc-editor-banner')
export class KCEditorBanner extends LitElement {
    @property({ type: String })
    public head : string = '';
    @property({ type: String })
    public text : string = '';
    @property({ type: String })
    public buttonLabel : string = 'Next';
    @property({ type: Number })
    public progress : number = 0;
    @property({ type: Boolean })
    showSaveButton : boolean = false;
    @property({ type: String })
    buttonState : 'active'|'inactive'|'hidden' = 'inactive';
    static get styles() {
        return [css`
            @keyframes pop-in {
                0% {
                    transform: scale(1, 1);
                }
                50% {
                    transform: scale(1.1, 1.1);
                }
                100% {
                    transform: scale(1.0, 1.0);
                }
            }
            :host {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                padding: 16px;
                background: white;
                box-sizing: border-box;
                border-radius: 6px;
                box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
                animation: pop-in 200ms linear 1;
            }
            .content {
                flex: 1;
                flex-basis: 0.000000001px;
                display: flex;
                flex-direction: row;
                height: 100%;
                box-sizing: border-box;
                font-family: var(--font-body);
                font-size: 16px;
                color: #22272D;
                min-width: 200px;
                display: inline-block;
            }
            .content .head {
                color: #888;
                margin-bottom: 5px;
            }
            .content .body {
                flex: 1;
                flex-basis: 0.000000001px;
            }
            :host([show-save-button]) .animations-pager {
                height: 50px;
                width: 50px;
                margin: 0 25px;
            }
            .text {
                display: flex;
                flex-direction: column;
                flex: 1;
                flex-basis: 0.000000001px;
            }
            .buttons {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            .button {
                opacity: 0;
                animation-duration: 0.3s;
                animation-fill-mode: forwards;
                border: none;
                outline: none;
                cursor: pointer;
                font-family: var(--font-body);
                text-transform: uppercase;
                overflow: hidden;
                white-space: nowrap;
                background-color: var(--color-chateau);
                box-sizing: border-box;
                color: white;
                font-size: 14px;
                font-weight: bold;
                border-radius: 3px;
                box-sizing: border-box;
                padding: 7px 24px;
                margin: 0;
                transition: background 300ms;
            }
            .button:hover {
                background-color: #5B646B;
            }
            #banner-save-button {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin: 0 10px 10px 0;
            }
            .markdown-html p {
                margin: 0px;
            }
            .markdown-html kano-blockly-block {
                line-height: 0px;
                vertical-align: middle;
                display: inline-block;
            }
            [hidden] {
                display: none !important;
            }
            .emoji {
                max-width: 18px;
                max-height: 18px;
                transform: translateY(4px);
            }
            .button.inactive {
                filter: grayscale(100%);
                cursor: wait;
            }
            #banner-button {
                background: transparent;
                color: black;
                padding: 0px;
                font-size: 16px;
            }
            #banner-button-container {
                display: inline-block;
            }
            #banner-button.hidden {
                display: none;
            }
            #banner-button:disabled {
                opacity: 0.5;
                background: transparent !important;
            }
        `, challengeStyles];
    }
    render() {
        return html`
        ${templateContent(button)}
        <div class="content">
            <div class="text">
                ${this.head.length ? this.headEl : ''}
                <div class="body">
                    <div class="markdown-html" id="markdown-html">
                        ${marked(this.text)}
                    </div>
                </div>
            </div>
        </div>
        <div class="buttons">
            <button class="btn" id="banner-save-button" @click=${this._saveTapped} hidden=${!this.showSaveButton}>
                Save
            </button>
            <div id="banner-button-container">
                <button id="banner-button" class="btn ${this.buttonState || 'hidden'}" @click=${this._buttonTapped} ?disabled=${this.buttonState === 'inactive'}>
                    ${this.buttonLabel}
                </button>
            </div>
        </div>
`;
    }
    get headEl() {
        return html`
        <div class="head">
            <div class="markdown-html" id="markdown-html">
                ${marked(this.head)}
            </div>
        </div>
        `;
    }
    _saveTapped() {
        this.dispatchEvent(new CustomEvent('save-button-clicked', { bubbles: true, composed: true }));
    }
    _buttonTapped() {
        if (this.buttonState !== 'inactive') {
            this.dispatchEvent(new CustomEvent('button-clicked', { bubbles: true, composed: true }));
        }
    }
}
