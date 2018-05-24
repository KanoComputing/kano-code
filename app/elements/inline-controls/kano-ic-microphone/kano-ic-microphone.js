import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { MicrophoneProxy } from '../../../scripts/kano/make-apps/microphone-proxy.js';
import { microphone } from '../../../scripts/kano/make-apps/parts-api/microphone.js';
import '../kano-value-rendering/kano-value-rendering.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-end-justified;
                color: white;
            }
            .visuals {
                @apply --layout-horizontal;
                @apply --layout-flex-auto;
                margin: 0 12px;
            }
            .data {
                width: 32px;
                @apply --layout-horizontal;
                @apply --layout-center-justified;
                flex-shrink: 0;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <div class="visuals" id="visuals">
            <canvas id="canvas" height="32" hidden\$="[[disabled]]"></canvas>
        </div>
        <div class="data">
            <kano-value-rendering width="12" height="12" value="[[value]]"></kano-value-rendering>
        </div>
`,

  is:'kano-ic-microphone',
  behaviors: [microphone, IronResizableBehavior],

  properties: {
      model: Object
  },

  listeners: {
      'iron-resize': '_initCanvas'
  },

  attached () {
      this.ctx = this.$.canvas.getContext('2d');
      this.values = [];
      MicrophoneProxy.start().then(() => {
          this._update();
          this._initCanvas();
      }).catch(error => {
          this.disabled = true;
      });
  },

  // Override the PartsAPI onCreated
  onCreated () {},

  _initCanvas () {
      if (!this.values) {
          return;
      }

      if (this._nextFrameId) {
          cancelAnimationFrame(this._nextFrameId);
      }
      this.$.canvas.style.width = '100%';
      this.$.canvas.width = this.$.canvas.offsetWidth;
      this.async(() => this._render());
  },

  _update () {
      this._updateInterval = setInterval(() => {
          let volume = MicrophoneProxy.getVolume();
          this.values.push(volume);
          if (this.values.length > Math.round(this.$.canvas.width / 8) + 1) {
              this.values.shift();
          }
          this.set('value', Math.round(volume));
      }, 100);
  },

  _render () {
      const step = 8,
          height = 32,
          spacing = 2;
      let barHeight;
      this.ctx.clearRect(0, 0, this.$.canvas.width, this.$.canvas.height);
      this.ctx.save();
      this.ctx.translate(0.5, 0.5);
      this.ctx.fillStyle = '#8F9195';
      for (var i = 0; i < this.values.length; i++) {
          barHeight = this.values[i] / 100 * height;
          this._fillRoundedRect(this.ctx, i * step - spacing, height / 2 - barHeight / 2, step - spacing * 2, barHeight, 1);
      }
      this.ctx.restore();

      this._nextFrameId = requestAnimationFrame(this._render.bind(this));
  },

  _fillRoundedRect (ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
  },

  detached () {
      clearInterval(this._updateInterval);
      cancelAnimationFrame(this._nextFrameId);
  }
});
