import '@polymer/marked-element/marked-element.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/* globals Polymer */
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --layout-center-justified;
                position: relative;
                text-align: left;
            }
            :host code {
                font-family: monospace;
                color: #aabbc3;
                font-size: 14px;
                overflow-y: auto;
                border-radius: 6px;
                padding: 0 36px;
            }
            :host .modal-content {
                @apply --layout-vertical;
            }
            :host .line {
                padding-left: 20px;
            }
            :host .line .key {
                color: #80cbc4;
            }
            :host .line .value {
                color: orange;
            }
            :host .line .colon {
                color: #ae94dd;
            }
            :host .line .comment {
                color: #49656f;
            }
            *[hidden] {
                display: none !important;
            }
    </style>
        <code>
            <div>{</div>
            <template is="dom-repeat" items="{{dataDefinition}}" as="property" id="repeat">
                <div class="line">
                    <span class="key">[[property.key]]</span>
                    <span class="colon">:</span>
                    <span class="value">[[computeValue(property, dataValues)]]</span>
                    <span class="comma">,</span>
                    <span class="comment">//&nbsp;[[property.description]]</span>
                </div>
            </template>
            <div><span>}</span><span hidden\$="[[!trailingComma]]">,</span></div>
        </code>
`,

  is: 'kano-data-display',

  properties: {
      dataDefinition: {
          type: Array
      },
      dataValues: {
          type: Object
      },
      trailingComma: Boolean
  },

  computeValue (property, dataValues) {
      let value = dataValues && typeof dataValues[property.key] !== 'undefined' ?
              dataValues[property.key] : `<${property.label}>`;
      return value;
  }
});
