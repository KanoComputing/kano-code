import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/button.js';
import '@kano/kwc-style/typography.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: flex;
flex-direction: row;
                @apply --layout-justified;
                align-items: center;
                color: #fff;
                height: 59px;
                padding: 0 16px;
                font-family: var(--font-body);
                --kc-dialog-topbar-button-hover-background: var(--kc-dialog-topbar-icon-color, #6E7377);
            }
            iron-icon {
                margin-right: 8px;
                --iron-icon-fill-color: var(--kc-dialog-topbar-icon-color, white);
            }
            .title {
                font-size: 18px;
                font-weight: bold;
                margin-left: 8px;
                cursor: default;
                color: inherit;
            }
            .action {
                flex: 1 1 auto;
                display: flex;
flex-direction: row;
                @apply --layout-end-justified;
            }
            .action ::slotted(button) {
                @apply --kano-button;
                border-radius: 3px;
                background: #54595d;
                font-size: 14px;
                font-weight: bold;
                text-shadow: none;
                padding: 8px 24px;
            }
            .action ::slotted(button:hover) {
                background-color: var(--kc-dialog-topbar-button-hover-background, #6E7377);
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <iron-icon id="icon" icon="[[icon]]" hidden\$="[[!icon]]"></iron-icon>
        <div class="title">[[label]]</div>
        <div class="action">
            <slot name="action"></slot>
        </div>
`,

  is: 'kc-dialog-topbar',

  properties: {
      icon: {
          type: String,
          value: null
      },
      label: String
  }
});
