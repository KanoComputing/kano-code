/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { LitElement, customElement, html, property, css } from 'lit-element/lit-element.js';

@customElement('kc-toolbox-entry-preview')
export class KcToolboxEntryPreview extends LitElement {

    @property({ type: String })
    public name : string = '';

    @property({ type: String })
    public color : string = '';
    
    static get styles() {
        return [css`
            :host {
                display: inline-flex;
                flex-direction: row;
                align-items: center;
                color: white;
                font-family: var(--font-body);
                font-weight: bold;
                text-align: left;
                box-sizing: border-box;
                padding: 0px 5px;
                border-radius: 4px;
                height: 20px;
            }
        `];
    }
    render() {
        return html`${this.name}`;
    }
    update(changedProps : Map<string, unknown>) {
        super.update(changedProps);
        if (changedProps.has('color')) {
            this.style.background = this.color;
        }
    }
}
