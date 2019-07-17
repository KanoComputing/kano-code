
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

    static get styles() {
        return [css`
            :host {
                position: relative;
                display: flex;
                flex-direction: column;
                background: #FFFF;
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
        
            .content {
                flex-direction: column;
                font-family: var(--font-body);
                font-size: 16px;
                color: #22272D;
                padding: 12px;
            }
            .actions::slotted(*) {
                margin-top: 12px;
            }
            .title {
                color: var(--color-grey);
                font-weight: bold;
                display: inline;
                flex: 1;
            }
            .markdown-html p {
                line-height: 20px;
                margin: 0px;
                font-weight: bold;
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
            }
        `, challengeStyles];
    }
    render() {
        return html`
        <div class="block block-1">
            <slot name="block-button"></slot>
            <slot name="avatar"></slot>
            <div class="title">${this.title}</div>
        </div>
        <div class="content">
            <slot name="avatar"></slot>
            <div class="markdown-html" id="markdown-html">
                ${marked(this.text)}
            </div>
            <slot name="actions" class="actions"></slot>
        </div>
        <!-- @TODO are we supporting remix for first release? should they have their own banner given markup design differ? -->
        <!-- <div class="block remix">
            <slot name="title-remix" class="title-remix"></slot>
            <slot name="tips" class="tips"></slot>
            <slot name="block-remix-actions" class="actions"></slot>
        </div> -->
`;
    }
}
