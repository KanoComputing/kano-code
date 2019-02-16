/**
`kano-alert`

Example:
    <kano-alert heading=""
                       text=""
                       icon-color="">
        <div slot="icon"></div>
        <div slot="actions"></div>
    </kano-alert>

### Slotted content
The default icon, as well as the action controls can be replaced with slotted content.
You can use 'kano-alert-primary' and 'kano-alert-secondary' classes for buttons in the actions slot.

```html

<kano-alert>
    <button class="kano-alert-primary" slot="actions">Confirm</button>
    <button class="kano-alert-secondary" slot="actions">Cancel</button>
</kano-alert>

```

The following custom properties and mixins are also available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--kano-alert`                  | Mixin applied to kano-alert    | `{}`
`--kano-alert-icon-background`  | Background of the icon                | `#8d8d8d`
`--kano-alert-header`           | Mixin applied to the header           | `{}`
`--kano-alert-text`             | Mixin applied to the text             | `{}`
`--kano-alert-action-container` | Mixin applied to the action container | `{}`

@group Kano Elements
@hero hero.svg
@demo ./kano-alert/demo/kano-alert.html
*/

import { PaperDialogBehavior } from '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';
import '@polymer/marked-element/marked-element.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import '@kano/styles/typography.js';
import { button } from '@kano/styles/button.js';
import { warning } from './icons.js';

export class KanoAlert extends mixinBehaviors([PaperDialogBehavior], PolymerElement) {
    static get template() {
        return html`
        ${button}
        <style>
            :host {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                @apply --shadow-elevation-16dp;
                font-family: var(--font-body);
                background-color: #fff;
                color: #414a51;
                border-radius: 6px;
                padding: 28px 52px 28px 28px;
                @apply --kano-alert;
            }
            .badge {
                box-sizing: border-box;
                background: var(--kano-alert-icon-background, #8d8d8d);
                border-radius: 50%;
                padding: 12px;
                margin: 6px 28px 6px 4px;
            }
            .badge svg {
                transform: rotate(-9deg);
                width: 26px;
                height: 26px;
                fill: #fff;
            }
            h2 {
                font-family: var(--font-body);
                font-size: 20px;
                font-weight: bold;
                line-height: 24px;
                margin: 0 0 4px 3px;
                @apply --kano-alert-header;
            }
            [slot="markdown-html"] p {
                font-size: 14px;
                line-height: 20px;
                margin: 4px 0 18px 3px;
                @apply --kano-alert-text;
            }
            .actions {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                @apply --kano-alert-action-container;
            }
            .actions button,
            .actions ::slotted(button.kano-alert-primary),
            .actions ::slotted(button.kano-alert-secondary) {
                margin-right: 12px;
            }
            .actions button.primary,
            .actions ::slotted(button.kano-alert-primary) {
                background: #ff6900;
                color: #fff;
            }
            .actions button.primary:hover,
            .actions ::slotted(button.kano-alert-primary:hover) {
                background-color: #ff7d14;
            }
            .actions button.secondary,
            .actions ::slotted(button.kano-alert-secondary) {
                background: #e1e1e1;
            }
            .actions button.secondary:hover,
            .actions ::slotted(button.kano-alert-secondary:hover) {
                background: #e9e9e9;
            }
        </style>
        <slot name="icon">
            <div class="badge">
                ${warning}
            </div>
        </slot>
        <div class="dialog-text">
            <h2>[[heading]]</h2>
            <marked-element markdown="[[text]]">
                <div class="markdown-html" slot="markdown-html"></div>
            </marked-element>
            <div class="actions">
                <slot name="actions">
                    <button id="primary-btn" type="button" class="btn primary" dialog-confirm>Confirm</button>
                    <button type="button" class="btn secondary" dialog-dismiss>Cancel</button>
                </slot>
            </div>
        </div>
        `;
    }
    static get properties() {
        return {
            heading: String,
            text: String,
        };
    }
    open() {
        this.backdropElement.style.background = '#414a51';
        super.open();
        if ('animate' in HTMLElement.prototype) {
            this.animate({
                transform: ['scale(1.5, 1.5)', 'scale(1, 1)'],
                opacity: [0, 1],
            }, {
                duration: 200,
                easing: 'ease-out',
                fill: 'both',
            });
        }
    }
    close() {
        if ('animate' in HTMLElement.prototype) {
            this.animate({
                opacity: [1, 0],
            }, {
                duration: 200,
                easing: 'ease-in',
                fill: 'both',
            }).finished.then(() => {
                super.close();
            });
        } else {
            super.close();
        }
    }
}

customElements.define('kano-alert', KanoAlert);

