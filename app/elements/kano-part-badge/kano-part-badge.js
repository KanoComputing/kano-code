import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '../kano-icons/parts.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                border: 1px solid #41464C;
                border-radius: 3px;
                background: #41464C;
                color: white;
                padding: 6px 8px;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            .value {
                padding: 1px 4px;
                border-radius: 3px;
                background: var(--kano-part-badge-value-background, #292F34);
                margin-left: 6px;
                font-size: 12px;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <div class="icon">
            <iron-icon icon="parts:[[icon]]" hidden\$="[[!icon]]"></iron-icon>
            <slot name="icon"></slot>
        </div>
        <div class="label">[[label]]</div>
        <div class="value" hidden\$="[[_isValueHidden(value)]]">[[value]]</div>
`,

  is:'kano-part-badge',

  properties: {
      label: String,
      value: {
          type: Number,
          value: null
      },
      icon: {
          type: String,
          value: null
      }
  },

  _isValueHidden (value) {
      return value === null;
  }
});
