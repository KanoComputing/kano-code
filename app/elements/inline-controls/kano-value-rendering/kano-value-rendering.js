import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/typography.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
        </style>
        <canvas id="canvas" style\$="width: [[width]]px; height: [[height]]px" width\$="[[_canvasWidth]]" height\$="[[_canvasHeight]]"></canvas>
`,

  is:'kano-value-rendering',

  properties: {
      width: {
          type: Number,
          value: 12
      },
      height: {
          type: Number,
          value: 12
      },
      offsetX: {
          type: Number,
          value: 0
      },
      offsetY: {
          type: Number,
          value: 0
      },
      _canvasWidth: {
          type: Number,
          computed: '_double(width)'
      },
      _canvasHeight: {
          type: Number,
          computed: '_double(height)'
      },
      value: {
          type: String,
          observer: '_render'
      },
      font: {
          type: String,
          value: '24px Bariol',
          observer: '_updateFont'
      },
      color: {
          type: String,
          value: 'white',
          observer: '_updateColor'
      },
      textAlign: {
          type: String,
          value: 'center'
      },
      textBaseline: {
          type: String,
          value: 'middle'
      }
  },

  attached () {
      this._updateFont();
      this._updateColor();
      this._render();
  },

  _getContext () {
      if (!this.ctx) {
          this.ctx = this.$.canvas.getContext('2d');
      }
      return this.ctx;
  },

  _updateFont () {
      this._getContext().font = this.font;
  },

  _updateColor () {
      this._getContext().fillStyle = this.color;
  },

  _double (value) {
      return value * 2;
  },

  _render () {
      let value = this.value,
          ctx = this._getContext();
      if (!this.ctx) {
          return;
      }
      if (typeof value === 'undefined') {
          value = '';
      }
      ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
      ctx.textAlign = this.textAlign;
      ctx.textBaseline = this.textBaseline;
      ctx.fillText(value, this._canvasWidth / 2 + this.offsetX, this._canvasHeight / 2 + this.offsetY);
  }
});
