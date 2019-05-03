import '@kano/styles/typography.js'
import '@kano/styles/color.js'
import { html } from 'lit-html/lit-html.js';
import { close } from '@kano/icons/ui.js';
import { Tooltip } from '../../widget/tooltip.js';
import { templateContent } from '../../directives/template-content.js';
import { EventEmitter } from '@kano/common/index.js';

export class RemixTooltip extends Tooltip {
    private _onDidDismiss = new EventEmitter();
    get onDidDismiss() { return this._onDidDismiss.event; }
    render(markdown : string) {
        return html`
            <style>
                button {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    background: transparent;
                    border: none;
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--color-grey);
                    align-self: flex-start;
                    margin: 0px 8px 8px;
                    padding: 8px;
                    cursor: pointer;
                    font-family: var(--font-body);
                }
                button>svg {
                    width: 10px;
                    height: 10px;
                    background: var(--color-grey);
                    fill: white;
                    border-radius: 6px;
                    padding: 5px;
                    margin-right: 4px;
                }
                button:focus,
                button:hover {
                    color: var(--color-chateau);
                    outline: none;
                }
                button:hover>svg {
                    background: var(--color-carnation);
                }
            </style>
            ${super.render(markdown)}
            <button @click=${() => this._onClick()}>${templateContent(close)}<span>Got it</span></button>
        `;
    }
    _onClick() {
        this._onDidDismiss.fire();
    }
}
