import '@polymer/iron-image/iron-image.js';
import { AnimatableBehavior } from '../behaviors/kano-animatable-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */

const IMAGE_PADDING = 20;
const DEFAULT_SELECTED_COLOUR = '#84C69E';

Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            :host[disabled] label {
                color: grey;
            }
            :host:hover {
                cursor: pointer;
            }
            :host .container {
                @apply(--layout-vertical);
                @apply(--layout-wrap);
                @apply(--layout-center);
            }
            :host .overlay {
                position: absolute;
                border-radius: 50%;
                top: 0px;
                bottom: 0px;
                left: 0px;
                right: 0px;
                background-color: rgba(0, 0, 0, 0.45);
            }
            :host .img-container {
                position: relative;
                border-radius: 50%;
                background-color: #CCC;
                overflow: hidden;
                transition: all ease-in 150ms;
            }
            :host iron-image {
                margin: 10px;
            }
            :host label {
                margin-top: 5px;
                font-size: 14px;
                text-align: center;
                color: #4A4A4A;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 62px;
                white-space: nowrap;
            }
        </style>
        <div class="container" on-tap="handleSelect">
            <div class="img-container" style\$="[[containerStyle]]">
                <iron-image src="{{model.image}}" preload="" fade="" sizing="contain" width="[[size]]" height="[[size]]"></iron-image>
                <template is="dom-if" if="[[disabled]]">
                    <div class="overlay"></div>
                </template>
            </div>
            <label style\$="[[computeLabelStyle(selected, instance, noLabel)]]">{{computeLabel(model.*)}}</label>
        </div>
`,

  is: 'kano-ui-item',
  behaviors: [AnimatableBehavior],

  properties: {
      model: {
          type: Object,
          value: () => {
              return {};
          }
      },
      size: {
          type: Number,
          value: 42
      },
      selected: {
          type: Boolean,
          value: false
      },
      instance: {
          type: Boolean,
          value: false
      },
      disabled: {
          type: Boolean,
          value: false
      },
      colour: {
          type: String,
          value: null
      },
      noLabel: {
          type: Boolean,
          value: false
      }
  },

  observers: [
      'computeContainerStyle(selected, instance, model.*, colour)'
  ],

  attached () {
      this.fire('ui-ready', this);
  },

  computeLabel () {
      return this.model.name || this.model.label;
  },

  computeContainerStyle (selected, instance) {
      let colour = this.colour;
      this.debounce('computeContainerStyle', () => {
          this.containerStyle = `background-color: ${colour};
                                  width: ${this.size + IMAGE_PADDING}px;
                                  height: ${this.size + IMAGE_PADDING}px;`;
      }, 10);
  },

  computeLabelStyle (selected) {
      if (this.noLabel) {
          return 'display: none;';
      }

      if (this.instance) {
          return;
      }
      let colour = selected ? DEFAULT_SELECTED_COLOUR : '';
      return `color: ${colour};`;
  },

  handleSelect () {
      this.fire('selected', this.model);
  }
});
