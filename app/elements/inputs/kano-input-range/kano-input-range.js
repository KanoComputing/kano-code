/*
### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--kano-input-range-label`
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Input } from '../behaviors.js';
import '../../kano-code-shared-styles/kano-code-shared-styles.js';
import '../../kano-slider/kano-slider.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style include="kano-code-shared-styles">
            :host {
                @apply --layout-vertical;
                font-family: var(--font-body);
            }
            label {
                @apply --kano-part-editor-label;
            }
            .slider-container {
                background: #484d53;
                border-radius: 3px;
                padding: 8px 6px 5px;
            }
            :host .display {
                @apply --layout-horiztonal;
                @apply --layout-center-justified;
                position: relative;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                margin: 0 0 5px 4px;
                overflow: hidden;
                @apply --kano-input-range-display;
            }
            :host .display span.symbol {
                font-size: 12px;
                text-transform: none;
            }
        </style>
        <label hidden\$="[[!label]]">[[label]]</label>
        <div class="slider-container">
            <div id="display" class="display">[[_roundValue(value)]]<span hidden\$="[[!symbol]]" class="symbol"> [[symbol]]</span></div>
            <kano-slider id="slider" min="[[min]]" max="[[max]]" value="{{value}}" theme="[[theme]]"></kano-slider>
        </div>
`,

  is: 'kano-input-range',
  behaviors: [Input],

  properties: {
      theme: String
  },

  _roundValue (value) {
      return Math.round(parseFloat(value));
  }
});
