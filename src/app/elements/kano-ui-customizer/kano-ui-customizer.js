import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../inputs/kano-input/kano-input.js';
import '../inputs/kano-input/kano-input.js';
import '../kano-code-shared-styles/kano-code-shared-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer */
Polymer({
  _template: html`
        <style include="kano-code-shared-styles">
            :host {
                display: flex;
flex-direction: column;
                --kwc-color-picker-size: 29px;
                --kano-color-input-field: {
                    margin: 14px auto 0;
                };
            }
            kano-input {
                margin-bottom: var(--kano-part-editor-input-margin, 24px);
            }
        </style>
        <template is="dom-repeat" items="{{customizable}}" as="property"> 
            <kano-input id\$="[[property.key]]" type="{{property.type}}" label="{{property.label}}" symbol="{{property.symbol}}" on-value-changed="propertyChanged" value="[[computeValue(property.key, userValues)]]" min="[[property.min]]" max="[[property.max]]" options="[[property.options]]" theme="[[theme]]"></kano-input>
        </template>
`,

  is: 'kano-ui-customizer',

  properties: {
      userValues: {
          type: Object,
          notify: true
      },
      customizable: {
          type: Array,
          value: () => []
      },
      theme: String
  },

  propertyChanged(e) {
      if (e.composedPath()[0].tagName !== 'KANO-INPUT') {
          return;
      }
      let propertyName = e.model.get('property.key'),
          value = e.detail.value;

      if (typeof value === 'number') {
          if (propertyName == 'width' || propertyName == 'height') {
                value = `${value.toString()}px`;
          } else if (propertyName == 'font-size') {
                value = `${value.toString()}em`;
          }
      }
      this.set(`userValues.${propertyName}`, value);
  },

  computeValue(propertyName) {
      if (!this.userValues) {
          return;
      }
      let value = this.userValues[propertyName];

      if (this._needParsing(value)) {
          value = parseFloat(value, 10);
      }
      return value;
  },

  _needParsing (value) {
      return /\d*\.?\d+(?:px|em)/.test(value);
  }
});
