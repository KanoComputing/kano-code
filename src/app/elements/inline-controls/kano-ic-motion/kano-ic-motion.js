import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '../kano-value-rendering/kano-value-rendering.js';
import '../../kano-icons/kc-ui.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: flex;
flex-direction: row;
                @apply --layout-end-justified;
                color: #fff;
            }
            .data {
                width: 32px;
            }
            .gesture-icons {
                flex: 1 1 auto;
                display: flex;
flex-direction: row;
                @apply --layout-around-justified;
                max-width: 196px;
                margin-right: 8px;
            }
            iron-icon {
                --iron-icon-width: 28px;
                --iron-icon-height: 28px;
                fill: #8F9195;
                transform: scale(0.7);
            }
            iron-icon:nth-child(2) {
                transform: rotate(90deg) scale(0.7);
            }
            iron-icon:nth-child(3) {
                transform: rotate(180deg) scale(0.7);
            }
            iron-icon:last-child {
                transform: rotate(-90deg) scale(0.7);
            }
            [hidden] {
                display: none !important;
            }
        </style>
            <div class="data" hidden\$="[[_isSelected(model.userProperties.mode, 'gesture')]]">
                <kano-value-rendering width="32" height="32" value="[[value]]"></kano-value-rendering>
            </div>
            <div class="gesture-icons" hidden\$="[[_isSelected(model.userProperties.mode, 'proximity')]]">
                <iron-icon id="up-arrow" icon="kc-ui:arrow"></iron-icon>
                <iron-icon id="right-arrow" icon="kc-ui:arrow"></iron-icon>
                <iron-icon id="down-arrow" icon="kc-ui:arrow"></iron-icon>
                <iron-icon id="left-arrow" icon="kc-ui:arrow"></iron-icon>
            </div>
`,

  is:'kano-ic-motion',

  properties: {
      model: {
          type: Object
      },
      rotationMap: {
          type: Object,
          value: () => {
              return {
                  'up': '0',
                  'right': '90deg',
                  'down': '180deg',
                  'left': '-90deg'
              };
          }
      }
  },

  observers: [
      '_onConnectedChanged(model.connected)',
      '_onGestureValueChanged(model.gestureValue)'
  ],

  detached () {
      this._resetLoop();
  },

  _onConnectedChanged (connected) {
      if (connected) {
          this._resetLoop();
          this._updateInterval = setInterval(() => {
              this.set('value', Math.round(this.model.lastProximityValue));
          }, 100);
      } else {
          this._resetLoop();
          this.set('value',  0);
      }
  },

  _resetLoop () {
      if (this._updateInterval) {
          clearInterval(this._updateInterval);
      }
  },

  _onGestureValueChanged (value) {
      if (!value) {
          return;
      }
      const selectedEl = this.$[`${value}-arrow`],
          rotation = this.rotationMap[value];

      selectedEl.animate([{
          transform: `rotate(${rotation}) scale(0.7)`,
          fill: this.arrowAnimating ? '#fff' : '#8F9195',
          offset: 0
      }, {
          transform: `rotate(${rotation}) scale(1)`,
          fill: '#fff',
          offset: 0.03
      }, {
          transform: `rotate(${rotation}) scale(0.8)`,
          fill: '#fff',
          offset: 0.15
      }, {
          transform: `rotate(${rotation}) scale(0.8)`,
          fill: '#fff',
          offset: 0.88
      }, {
          transform: `rotate(${rotation}) scale(0.7)`,
          fill: '#8F9195',
          offset: 1
      }],{
          duration: 1000,
          easing: 'ease-in'
      }).onFinish = () => {
          this.arrowAnimating = false;
      };
      this.arrowAnimating = true;
  },

  _isSelected (mode, expected) {
      return mode === expected;
  }
});
