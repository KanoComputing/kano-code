import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-image/iron-image.js';
import '@kano/kwc-style/color.js';
import '@kano/kwc-style/typography.js';
import '../inline-controls/kano-value-rendering/kano-value-rendering.js';
import '../inputs/kano-input-toggle/kano-input-toggle.js';
import '../kano-icons/kc-ui.js';
import '../kano-part-editor-topbar/kano-part-editor-topbar.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-vertical;
                font-family: var(--font-body);
            }
            kano-part-editor-topbar {
                border-color: #202428;
            }
            footer {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
                padding: 24px 0px;
                border-top: 1px solid #202428;
            }
            footer span:not([selected]) {
                color: var(--color-grey);
                font-weight: normal;
            }
            footer span {
                @apply --layout-flex;
                transition: color 120ms linear;
                font-weight: bold;
                cursor: pointer;
            }
            footer span.distance {
                text-align: right;
                padding-right: 32px;
            }
            footer span.swipe {
                padding-left: 32px;
            }
            .visualisation {
                @apply --layout-vertical;
                @apply --layout-center;
                padding: 48px 52px 32px;
            }
            .data {
                @apply --layout-horizontal;
                background: #202428;
                width: 140px;
                height: 60px;
                border-radius: 3px;
            }
            .motion-big {
                width: 100%;
                height: 200px;
                margin-bottom: 32px;
            }
            .arrow-box {
                @apply --layout-flex-auto;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            iron-icon {
                --iron-icon-width: 40px;
                --iron-icon-height: 40px;
                transform: scale(0.8);
                fill: #8F9195;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <kano-part-editor-topbar icon="motion-sensor" label="[[selected.label]]" theme="[[theme]]"></kano-part-editor-topbar>
        <div class="visualisation">
            <iron-image class="motion-big" src="/assets/part/motion-big.svg" sizing="contain"></iron-image>
            <div class="data">
                <kano-value-rendering width="140" height="60" value="[[_proximityData]]" font="bold 52px Bariol" color="white" hidden\$="[[_isSelected(selected.userProperties.mode, 'gesture')]]"></kano-value-rendering>
                <div class="arrow-box" hidden\$="[[_isSelected(selected.userProperties.mode, 'proximity')]]">
                    <iron-icon id="arrow" icon="kc-ui:arrow"></iron-icon>
                </div>
            </div>
        </div>
        <footer>
            <span class="distance" on-tap="_selectProximity" selected\$="[[_isSelected(selected.userProperties.mode, 'proximity')]]">Distance mode</span>
            <kano-input-toggle id="toggle" checked="{{_toggleChecked}}" data-animate\$="[[_computeDataAnimate('450', visible)]]"></kano-input-toggle>
            <span class="swipe" on-tap="_selectGesture" selected\$="[[_isSelected(selected.userProperties.mode, 'gesture')]]">Gesture mode</span>
        </footer>
`,

  is:'kano-motion-sensor-part-editor',
  behaviors: [AppElementRegistryBehavior],

  properties: {
      selected: {
          type: Object,
          notify: true
      },
      _toggleChecked: {
          type: Boolean,
          observer: '_toggleStateChanged'
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
      '_modeChanged(selected.userProperties.mode)',
      '_onGestureValueChanged(selected.gestureValue)'
  ],

  attached () {
      this._registerElement('motion-editor-mode-toggle', this.$.toggle);
      this.intervalId = setInterval(() => {
          this._proximityData = this.selected.lastProximityValue;
      }, 100);
  },

  _toggleStateChanged () {
      this.set('selected.userProperties.mode', this._toggleChecked ? 'gesture' : 'proximity');
  },

  _modeChanged () {
      this.set('_toggleChecked', this.selected.userProperties.mode === 'gesture');
  },

  _isSelected (mode, expected) {
      return mode === expected;
  },

  _selectProximity () {
      this._toggleChecked = false;
  },

  _selectGesture () {
      this._toggleChecked = true;
  },

  _onGestureValueChanged (value) {
      let lastRotation = this.lastRotation || '0',
          rotation;
      if (!value) {
          return;
      }
      rotation = this.rotationMap[value] || '0';
      this.$.arrow.animate([{
          transform: `rotate(${lastRotation}) scale(0.8)`,
          fill: this.arrowAnimating ? '#fff' : '#8F9195',
          offset: 0
      }, {
          transform: `rotate(${rotation}) scale(1)`,
          fill: '#fff',
          offset: 0.03
      }, {
          transform: `rotate(${rotation}) scale(0.9)`,
          fill: '#fff',
          offset: 0.15
      }, {
          transform: `rotate(${rotation}) scale(0.9)`,
          fill: '#fff',
          offset: 0.88
      }, {
          transform: `rotate(${rotation}) scale(0.8)`,
          fill: '#8F9195',
          offset: 1
      }],{
          duration: 1000,
          easing: 'ease-in',
          fill: 'forwards'
      }).onFinish = () => {
          this.arrowAnimating = false;
      };
      this.arrowAnimating = true;
      this.lastRotation = rotation;
  },

  detached () {
      clearInterval(this.intervalId);
  }
});
