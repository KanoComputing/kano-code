import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/color.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: inline-block;
                background: #4E575E;
                border-radius: 4px;
                overflow: hidden;
                z-index: 0;
                color: white;
                font-size: 16px;
                font-weight: 600;
                height: 30px;
            }
            .value {
                width: 26px;
                display: inline-block;
                text-align: center;
            }
            button {
                border: 0px;
                background: transparent;
                color: rgba(255, 255, 255, 0.6);
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                width: 30px;
                height: 100%;
            }
            button:hover, button:focus {
                outline: none;
                color: white;
            }
        </style>
        <button type="button" on-tap="_decr"><span>-</span></button>
        <div class="value">[[value]]</div>
        <button type="button" on-tap="_incr"><span>+</span></button>
`,

  is:'kano-input-incr',

  properties: {
      value: {
          type: Number,
          value: 0,
          notify: true
      },
      min: Number,
      max: Number
  },

  _decr () {
      this.setBoundsParameters(this.value - 1);
  },

  _incr () {
      this.setBoundsParameters(this.value + 1);
  },

  setBoundsParameters (v) {
      let value = v;
      if (typeof this.min !== 'undefined') {
          value = Math.max(this.min, value);
      }
      if (typeof this.max !== 'undefined') {
          value = Math.min(this.max, value);
      }
      this.set('value', value);
  }
});
