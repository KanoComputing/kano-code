/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import '@kano/styles/typography.js'
import '@kano/styles/color.js'
import { html } from 'lit-html/lit-html.js';
import { close } from '@kano/icons/ui.js';
import { Tooltip } from './tooltip.js';
import { templateContent } from '../directives/template-content.js';
import { EventEmitter } from '@kano/common/index.js';
import { _ } from '../i18n/index.js';

export class DismissableTooltip extends Tooltip {
    private _onDidDismiss = new EventEmitter();
    get onDidDismiss() { return this._onDidDismiss.event; }
    render(markdown : string) {
        return html`
            <style>
                p > svg {
                    width: 12px;
                    margin-right: 8px;
                    fill: var(--color-candlelight);
                    stroke: var(--color-pumpkin);
                }
                .tooltip-button {
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
                    padding: 0 8px 8px 8px;
                    cursor: pointer;
                    font-family: var(--font-body);
                }
                .tooltip-button>svg {
                    width: 10px;
                    height: 10px;
                    background: var(--color-grey);
                    fill: white;
                    border-radius: 6px;
                    padding: 5px;
                    margin-right: 4px;
                }
                .tooltip-button:focus,
                .tooltip-button:hover {
                    color: var(--color-chateau);
                    outline: none;
                }
                .tooltip-button:hover>svg {
                    background: var(--color-carnation);
                }
            </style>
            ${super.render(markdown)}
            <button class="tooltip-button" @click=${() => this._onClick()}>${templateContent(close)}<span>${_('GOT_IT', 'Got it')}</span></button>
        `;
    }
    _onClick() {
        this._onDidDismiss.fire();
    }
}
