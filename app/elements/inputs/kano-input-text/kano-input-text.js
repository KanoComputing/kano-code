import { Input } from '../behaviors.js';
import '../../kano-code-shared-styles/kano-code-shared-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style include="kano-code-shared-styles">
            :host {
                display: block;
            }
            label {
                @apply --kano-part-editor-label;
            }
            input {
                width: 100%;
                box-sizing: border-box;
                background-color: #484d53;
                height: 42px;
                border: 0;
                font-family: var(--font-body);
                font-size: 14px;
                font-weight: bold;
                line-height: 14px;
                color: #fff;
                padding-left: 8px;
                border-radius: 3px;
            }
            input:focus {
                background-color: #4E575E;
                outline: none;
                border: 2px solid rgba(255,255,255,0.25);
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <label hidden\$="[[!label]]">[[label]]</label>
        <input type="text" id="input" value="{{value::input}}" on-keydown="enterQuitsInput" autofocus="[[autofocus]]">
`,

  is: 'kano-input-text',
  behaviors: [Input],

  properties: {
      autofocus: Boolean
  },

  observers: [
      'valueChanged(value)',
      'themeChanged(theme)'
  ],

  focus () {
      this.$.input.focus();
  },

  select () {
      this.$.input.select();
  },

  valueChanged () {
      this.fire('change');
  },

  themeChanged (theme) {
      this.updateStyles({
          '--element-theme': theme
      });
  },

  enterQuitsInput (e) {
      if (e.key == 'Enter') {
          this.$.input.blur();
          return false;
      }
  }
});
