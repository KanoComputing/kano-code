
import '@kano/styles/color.js';
import '../kc-circle-progress/kc-circle-progress.js';
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
    public text : string = '';

    @property({ type: Number })
    public progress : number = 0;

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
                display: inline;
                vertical-align: middle;
                position: absolute;
                top: -15px;
            }
        
            .content {
                flex-direction: column;
                font-family: var(--font-body);
                font-size: 16px;
                color: #22272D;
                min-width: 200px;
                padding: 10px 14px 14px 14px;
            }

            .actions::slotted(*) {
                margin-top: 4px;
            }
            .title {
                color: #3e4042;
                opacity: 0.4;
                font-weight: bold;
                display: inline;
            }
            .markdown-html p {
                line-height: 28px;
                margin: 0px;
                font-weight: bold;
            }
            .markdown-html kano-blockly-block {
                line-height: 0px;
                vertical-align: middle;
                display: inline-block;
            }
            [hidden] {
                display: none !important;
            }
            .block {
                border-bottom: 1px solid rgb(62, 64, 66, 0.3);
                padding: 10px 0 10px 16px;
                font-family: var(--font-body);
                font-size: 16px;
            }
            .remix {
                border-top: 1px solid rgb(62, 64, 66, 0.3);
            }

        `, challengeStyles];
    }
    render() {
        return html`
        ${templateContent(button)}
        <div class="block block-1">
            <slot name="block-button"></slot>
            <slot name="avatar"></slot>
            <slot name="title" class="title"></slot>
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
