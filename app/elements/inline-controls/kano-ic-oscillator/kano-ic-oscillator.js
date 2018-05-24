import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { oscillator } from '../../../scripts/kano/make-apps/parts-api/oscillator.js';
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
        </style>
        <div class="visuals" id="visuals">
            <canvas id="canvas" height="32"></canvas>
        </div>
        <div class="data">
            <kano-value-rendering width="12" height="12" value="[[yValue]]"></kano-value-rendering>
        </div>
`,

  is:'kano-ic-oscillator',
  behaviors: [oscillator, IronResizableBehavior],

  properties: {
      model: {
          type: Object,
          value: () => {
              return {
                  x: 0
              };
          }
      }
  },

  attached () {
      this.ctx = this.$.canvas.getContext('2d');
      this.model.x = 0;
  },

  listeners: {
      'iron-resize': '_initCanvas'
  },

  _initCanvas () {
      if (this._nextFrameId) {
          cancelAnimationFrame(this._nextFrameId);
      }
      this.$.canvas.style.width = '100%';
      this.$.canvas.width = this.$.canvas.offsetWidth;
      this.async(() => this._render());
  },

  // Make sure the oscillation doesn't start. Here everthing is driven by the `x` given through the model
  _startOscillating () {},

  _render (timestamp) {
      let yScale = 0.5,
          width = this.$.canvas.width,
          height = 31,
          iterations = width / 0.5,
          middle = iterations / 2,
          x, y;
      this.ctx.fillStyle = 'black';
      this.ctx.clearRect(0, 0, this.$.canvas.width, this.$.canvas.height);
      this.ctx.beginPath();
      for (var i = 0; i < iterations; i++) {
          x = i / 2;
          y = height - this.getValueAt(this.model.x - i + iterations) * height / 100;
          y = y * yScale;
          y = y + (height - (height * yScale)) / 2;
          // only draw the line when not over the value marker
          if (i < middle - 2 || i > middle + 2) {
              this.ctx.lineTo(x, y);
          } else {
              this.ctx.moveTo(x, y);
          }
          if (i === middle) {
              this.ctx.strokeStyle = '#8F9195';
              this.ctx.stroke();
              this.ctx.closePath();
              this.ctx.beginPath();
              this.ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
              this.ctx.fillStyle = '#ffffff';
              this.ctx.fill();
              this.ctx.closePath();
              this.ctx.beginPath();
          }
      }
      this.ctx.strokeStyle = '#8F9195';
      this.ctx.stroke();
      this.ctx.closePath();

      if (!this.prevTimestamp || timestamp - this.prevTimestamp > 16) {
          this.prevTimestamp = timestamp;
          this.set('yValue', Math.round(this.getValue()));
      }

      
      this._nextFrameId = requestAnimationFrame(this._render.bind(this));
  },

  detached () {
      cancelAnimationFrame(this._nextFrameId);
  }
});
