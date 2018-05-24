import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '../kano-icons/parts.js';
import '@kano/kwc-style/color.js';
import '../inline-controls/kano-inline-controls.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Templatizer } from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
var themeColors = {
    'ui': '#00d9c7',
    'data': '#9b61bd',
    'hardware': '#ef5285'
};
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                color: #fff;
                font-size: 14px;
                white-space: nowrap;
            }
            iron-icon {
                --iron-icon-fill-color: #8F9195;
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
                margin: 8px 12px 8px 0;
                flex-shrink: 0;
            }
            .label {
                min-width: 60px;
            }
            .controls {
                @apply --layout-flex-auto;
                margin-left: 8px;
            }
            .disconnected {
                color: var(--color-rhubarb);
            }
        </style>
        <iron-icon id="icon" icon="parts:[[model.type]]" class="icon"></iron-icon>
        <div class\$="label {{_computeLabelClass(model.connected)}}">[[model.name]] {{_computeLabel(model.connected)}}</div>
        <div class="controls" id="controls"></div>
        <template id="oscillator">
            <kano-ic-oscillator id="inline-controls" model="[[model]]"></kano-ic-oscillator>
        </template>
        <template id="microphone">
            <kano-ic-microphone id="inline-controls" model="[[model]]"></kano-ic-microphone>
        </template>
        <template id="clock">
            <kano-ic-clock id="inline-controls" model="[[model]]"></kano-ic-clock>
        </template>
        <template id="motion-sensor">
            <kano-ic-motion id="inline-controls" model="[[model]]"></kano-ic-motion>
        </template>
        <template id="speaker">
            <kano-ic-speaker id="inline-controls" muted="{{model.muted}}"></kano-ic-speaker>
        </template>
        <template id="synth">
            <kano-ic-speaker id="inline-controls" muted="{{model.muted}}"></kano-ic-speaker>
        </template>
`,

  is:'kano-part-list-item',
  behaviors: [Templatizer],

  properties: {
      model: Object
  },

  observers: [
      '_mutedChanged(model.muted)',
      '_typeChanged(model.type)'
  ],

  listeners: {
      'mouseenter': '_applyColor',
      'mouseleave': '_unApplyColor'
  },

  _forwardParentProp (prop, value) {
      if (this.instance) {
          this.instance.__setProperty(prop, value);
      }
  },

  _forwardParentPath (path, value) {
      if (this.instance) {
          this.instance._notifyPath(path, value, true);
      }
  },

  _applyColor () {
      this.$.icon.style.fill = themeColors[this.model.partType];
  },

  _unApplyColor () {
      this.$.icon.style.fill = '#8F9195';
  },

  _computeLabelClass (connected) {
      return connected === false ? 'disconnected' : '';
  },

  _computeLabel (connected) {
      if (this.model.partType === 'data') {
          return connected === false ? '(data offline)' : '';
      } else if (this.model.partType === 'hardware') {
          return connected === false ? '(disconnected)' : '';
      }
  },

  _mutedChanged (muted) {
      this.fire('change', {
          type: 'change-part-volume',
          part: this.model
      });
  },

  _typeChanged (type) {
      let template = this.$[type];

      if (!template) {
          return;
      }

      this.templatize(template);

      this.instance = this.stamp({
          model: this.model
      });

      while (this.$.controls.firstChild) {
          this.$.controls.removeChild(this.$.controls.firstChild);
      }

      this.$.controls.appendChild(this.instance.root);
  }
});
