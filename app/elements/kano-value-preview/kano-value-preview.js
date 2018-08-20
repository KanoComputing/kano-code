import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
const HEX_COLOR_REGEXP = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/;
Polymer({
  _template: html`
        <style>
            :host {
                display: inline-block;
                vertical-align: middle;
            }
            :host .color-value {
                border-radius: 3px;
                border: 1px solid rgba(0, 0, 0, 0.55);
                width: 24px;
                height: 18px;
            }
            :host #input {
                border-radius: 3px;
                color: black;
                background: var(--kano-value-preview-input-background, rgba(255, 255, 255, 0.7));
                padding: 2px 6px;
                line-height: 1;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <div id="display" class\$="[[type]]">
            <div id="input" hidden\$="[[_isType(type, 'color-value')]]">
                <slot></slot>
            </div>
        </div>
`,

  is: 'kano-value-preview',

  properties: {
      type: {
          type: String,
          value: null
      }
  },

  attached () {
      this._render();
  },

  _render () {
      let value = this.textContent;
      if (HEX_COLOR_REGEXP.exec(value)) {
          this.type = "color-value";
          this.$.display.style.backgroundColor = value;
          this.$.input.innerHTML = '';
      } else {
          this.type = "simple-value";
      }
  },

  _isType (actual, expected) {
      return actual === expected;
  }
});
