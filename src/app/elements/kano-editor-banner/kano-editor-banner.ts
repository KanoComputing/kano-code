import '@polymer/marked-element/marked-element.js';
import '@kano/styles/color.js';
import '../kano-circle-progress/kano-circle-progress.js';
import { LitElement, css, html, customElement, property } from 'lit-element/lit-element.js';
import { templateContent } from '../../lib/directives/template-content.js';
import { button } from '@kano/styles/button.js';

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
    buttonState : 'active'|'inactive'|'hidden' = 'hidden';
    static get styles() {
        return [css`
            :host {
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                padding: 16px;
                display: block;
                background: white;
                box-sizing: border-box;
            }
            .container {
                display: flex;
                flex-wrap: wrap;
            }
            .avatar {
                margin-bottom: 10px;
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
                color: #414a51;
                margin-bottom: 10px;
                margin-right: 10px;
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
                display: block;
                margin-left: 56px;
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
            .button paper-spinner-lite {
                --paper-spinner-color: white;
                --paper-spinner-stroke-width: 2px;

                width: 18px;
                height: 18px;
                display: block;
                margin: 0px 7px;
            }
            kwc-button.active paper-spinner-lite {
                display: none;
            }
            kwc-button.hidden {
                display: none;
            }
            .button.inactive {
                filter: grayscale(100%);
                cursor: wait;
            }
            kano-circle-progress {
                margin-right: 16px;
                height: 40px;
                width: 40px;
                --kano-circle-progress: {
                    stroke: #fec02d;
                };
                --kano-circle-progress-back: {
                    stroke: var(--color-porcelain);
                };
            }
            button, kano-glint-animation {
                align-self: center;
            }
            .undo-redo button {
                border: none;
                outline: none;
                cursor: no-drop;
                padding: 3px 5px;
                transition: all 300ms;
                color: #d2d6d8;
            }
            .undo-redo button.active {
                color: #9fa4a8;
                cursor: pointer;
            }
            .undo-redo button.active:hover {
                color: var(--color-orange, #ff2800);
            }
            .undo-redo {
                margin: auto;
            }
            #banner-button {
                height: 38px;
            }
            #banner-button-container {
                display: inline-block;
            }
        `];
    }
    render() {
        return html`
        ${templateContent(button)}
        <div class="container">
            <div class="avatar">
                <kano-circle-progress radius="40" stroke-width="7" .value=${this.progress} ></kano-circle-progress>
            </div>
            <div class="content">
                <div class="text">
                    ${this.head.length ? this.headEl : ''}
                    <div class="body">
                        <marked-element .markdown=${this.text}>
                            <div class="markdown-html" slot="markdown-html"></div>
                        </marked-element>
                    </div>
                </div>
            </div>
        </div>
            <div class="buttons">
            <button class="btn" id="banner-save-button" @click=${this._saveTapped} hidden=${!this.showSaveButton}>
                Save
            </button>
            <div id="banner-button-container">
                <button id="banner-button" class="btn ${this.buttonState || 'hidden'}" @click=${this._buttonTapped} variant="primary">
                    ${this.buttonLabel}
                </button>
            </div>
        </div>
`;
    }
    get headEl() {
        return html`
        <div class="head">
            <marked-element .markdown=${this.head}>
                <div class="markdown-html" slot="markdown-html"></div>
            </marked-element>
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
