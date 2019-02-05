import '@polymer/polymer/polymer-legacy.js';
import '@kano/kwc-style/input.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../kano-part-editor-topbar/kano-part-editor-topbar.js';
import '../kano-ui-customizer/kano-ui-customizer.js';
import '../inputs/kano-input-text/kano-input-text.js';
import '../inputs/kano-input-range/kano-input-range.js';
import '../kano-code-shared-styles/kano-code-shared-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer */

Polymer({
  _template: html`
        <style include="kano-code-shared-styles input-range">
            :host {
                display: block;
                overflow: hidden;
            }
            .config {
                box-sizing: border-box;
                padding: var(--kano-part-editor-padding);
                max-height: var(--kano-part-editor-content-height);
                overflow: auto;
            }
            :host .input-line {
                display: flex;
flex-direction: row;
                align-items: center;
            }
            :host kano-input-range {
                flex: 1 1 auto;
            }
            .spacer {
                width: 32px;
            }
            .input {
                margin-bottom: var(--kano-part-editor-input-margin, 24px);
            }
            *[hidden] {
                display: none !important;
            }
        </style>
        <kano-part-editor-topbar icon="[[element.type]]" label="[[element.label]]" theme="[[theme]]"></kano-part-editor-topbar>
        <div class="config">
            <kano-input-text class="input" label="Name" value="{{name}}" theme="[[theme]]"></kano-input-text>
            <kano-ui-customizer id="properties" customizable="[[element.customizable.properties]]" user-values="{{element.userProperties}}" theme="[[theme]]"></kano-ui-customizer>
            <kano-ui-customizer id="style" customizable="[[element.customizable.style]]" user-values="{{element.userStyle}}" theme="[[theme]]"></kano-ui-customizer>
            <div hidden\$="[[!element.showDefaultConfiguration]]">
                <div class="input-line" hidden\$="[[element.positionDisabled]]">
                    <kano-input-range class="input" value="{{element.position.x}}" label="X Position" min="0" max="[[mode.workspace.viewport.width]]" theme="[[theme]]"></kano-input-range>
                    <div class="spacer" hidden\$="[[element.scaleDisabled]]"></div>
                    <kano-input-range class="input" value="{{element.position.y}}" label="Y Position" min="0" max="[[mode.workspace.viewport.height]]" theme="[[theme]]"></kano-input-range>
                </div>
                <div class="input-line">
                    <kano-input-range hidden\$="[[element.rotationDisabled]]" class="input" value="{{element.rotation}}" label="Rotation" min="0" max="360" symbol="°" theme="[[theme]]"></kano-input-range>
                    <div class="spacer" hidden\$="[[element.scaleDisabled]]"></div>
                    <kano-input-range hidden\$="[[element.scaleDisabled]]" class="input" value="{{element.scale}}" label="Scale" min="1" max="500" symbol="%" theme="[[theme]]"></kano-input-range>
                </div>
            </div>
        </div>
`,

  is: 'kano-ui-editor',

  properties: {
      element: {
          type: Object,
          notify: true,
      },
      mode: {
          type: Object
      },
      roundPosition: {
          type: Object
      },
      theme: {
          type: String,
          value: "#00d9c7"
      },
      name: {
          type: String,
          notify: true
      }
  },

  observers: [
      'computeRoundPosition(element.position.*)'
  ],

  computeRoundPosition () {
      let pos;
      if (!this.element) {
          return;
      }
      pos = this.element.position;
      if (!pos) {
          return;
      }
      this.set('roundPosition',{
          x: Math.ceil(pos.x) || 0,
          y: Math.ceil(pos.y) || 0
      });
  }
});
