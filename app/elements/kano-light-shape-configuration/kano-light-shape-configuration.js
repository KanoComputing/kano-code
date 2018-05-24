import '../kano-ui-customizer/kano-ui-customizer.js';
import '../inputs/kano-input/kano-input.js';
import '../inputs/kano-input-range/kano-input-range.js';
import '../kano-code-shared-styles/kano-code-shared-styles.js';
import '../kano-part-editor-topbar/kano-part-editor-topbar.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/input.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer */

Polymer({
  _template: html`
        <style is="custom-style" include="kano-code-shared-styles input-range">
            :host {
                display: block;
                overflow: hidden;
            }
            .config {
                box-sizing: border-box;
                max-height: var(--kano-part-editor-content-height);
                padding: var(--kano-part-editor-padding);
                overflow: auto;
            }
            kano-input {
                margin-bottom: var(--kano-part-editor-input-margin);
            }
            .position {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin-bottom: var(--kano-part-editor-input-margin);
            }
            .position>* {
                @apply --layout-flex-auto;
            }
            kano-input-range:first-child {
                margin-right: 32px;
            }
        </style>
        <kano-part-editor-topbar icon="[[element.type]]" label="[[element.label]]" theme="[[theme]]"></kano-part-editor-topbar>
        <div class="config">
            <kano-input type="text" label="Name" value="{{name}}" theme="[[theme]]"></kano-input>
            <kano-ui-customizer id="properties" customizable="{{element.customizable.properties}}" user-values="{{element.userProperties}}" theme="[[theme]]">
            </kano-ui-customizer>
            <kano-ui-customizer id="style" customizable="{{element.customizable.style}}" user-values="{{element.userStyle}}" theme="[[theme]]">
            </kano-ui-customizer>
            <div class="position">
                <kano-input-range value="{{position.x}}" label="X Position" min="1" max="[[maxX]]" theme="[[theme]]"></kano-input-range>
                <kano-input-range value="{{position.y}}" label="Y Position" min="1" max="[[maxY]]" theme="[[theme]]"></kano-input-range>
            </div>
        </div>
`,

  is: 'kano-light-shape-configuration',

  properties: {
      element: {
          type: Object,
          notify: true
      },
      position: {
          type: Object,
          value: () => {
              return {
                  x: 1,
                  y: 1
              };
          }
      },
      roundPosition: {
          type: Object
      },
      maxX: {
          type: Number,
          computed: '_computeMaxX(element.userProperties.*)',
          value: 16
      },
      maxY: {
          type: Number,
          computed: '_computeMaxY(element.userProperties.*)',
          value: 8
      },
      theme: String,
      name: {
          type: String,
          notify: true
      }
  },

  observers: [
      'computeRoundPosition(element.position.*)',
      '_positionChanged(element.position.*)',
      '_virtualPositionChanged(position.*)'
  ],

  _computeMaxX () {
      if (!this.element || !this.element.userProperties) {
          return 16;
      }
      return 16 - parseInt(this.element.userProperties.width || this.element.userProperties.radius) + 1 || 16;
  },

  _computeMaxY () {
      if (!this.element || !this.element.userProperties) {
          return 8;
      }
      return 8 - parseInt(this.element.userProperties.height || this.element.userProperties.radius) + 1 || 8;
  },

  _positionChanged () {
      if (this.element) {
          this.set('position.x', Math.round(this.element.position.x / 27) + 1);
          this.set('position.y', Math.round(this.element.position.y / 27) + 1);
      }
  },

  _virtualPositionChanged () {
      this.set('element.position.x', (Math.round(this.position.x - 1)) * 27);
      this.set('element.position.y', (Math.round(this.position.y - 1)) * 27);
  },

  computeRoundPosition () {
      let pos;
      if (!this.element) {
          return;
      }
      pos = this.element.position;
      if (!pos) {
          return;
      }
      this.set('roundPosition', {
          x: Math.ceil(pos.x) || 0,
          y: Math.ceil(pos.y) || 0
      });
  }
});
