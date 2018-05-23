import { WorkspaceBehavior } from '../behaviors/kano-workspace-behavior.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { lightboard } from '../../scripts/kano/make-apps/parts-api/lightboard.js';
import '../kano-bitmap-renderer/kano-bitmap-renderer.js';
import '../ui/kano-ui/kano-ui-lightboard.js';
import { Polymer } from '../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                position: relative;
            }

            #led-matrix {
                position: absolute;
                top: 37px;
                left: 17px;
                background-color: transparent;
            }

            :host ::slotted(*) {
                position: absolute;
                top: 1px;
                left: 0px;
            }
            :host([joystick-mouse-off]) #joystick,
            :host([joystick-mouse-off]) #joystick button.js-dir {
                pointer-events: none;
            }
            .btn {
                position: absolute;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 0px;
                cursor: pointer;
                background-color: #f64646;
            }
            .btn:hover,
            .btn.pressed {
                background-color: #ff6060;
            }
            /*Take off 'active' state if mouse leaves without releasing click*/
            .btn:not(:hover) {
                transform: scale(1);
            }
            .btn:focus {
                outline: none;
                @apply --shadow-elevation-2dp;
            }
            .btn.pressed {
                transform: scale(0.97);
            }
            #lightboard-btn-A {
                top: 266px;
                left: 411px;
            }
            #lightboard-btn-B {
                top: 266px;
                left: 365px;
            }
            #joystick {
                position: absolute;
                width: 34px;
                height: 34px;
                border-radius: 50%;
                cursor: pointer;
                top: 264px;
                left: 26px;
                background-color: #4c4f55;
                transition: transform cubic-bezier(0.2, 0, 0.13, 1.5) 100ms, opacity cubic-bezier(0.2, 0, 0.13, 1.5) 100ms;
                overflow: hidden;
                transform: rotate(45deg);
                opacity: 0;
                @apply --layout-horizontal;
                @apply --layout-wrap;
            }
            #joystick:hover,
            #joystick.pressed {
                transform: rotate(45deg) scale(2);
                opacity: 1;
            }
            #joystick:not(:hover) .js-dir
            #joystick:not(.pressed) .js-dir {
                opacity: 0 !important;
            }
            #joystick:hover .js-dir,
            #joystick.pressed .js-dir {
                opacity: 1;
            }
            .js-dir {
                padding: 0px;
                width: 50%;
                height: 50%;
                box-sizing: border-box;
                transition: opacity cubic-bezier(0.2, 0, 0.13, 1.5) 100ms;
                background-color: #3c3d3f;
                border: 0px;
                cursor: pointer;
                color: #000;
                box-shadow: none;
                border-radius: 0;
                display: block;
                font-weight: normal;
                text-transform: none;
                margin: 0;
            }
            #joystick button.js-dir:hover,
            #joystick button.js-dir.pressed {
                outline: none;
                background-color: #45474c;
            }
            #joystick button.js-dir:focus {
                outline: none;
            }
            #lightboard-js-up, #lightboard-js-left {
                margin-right: 1px;
                width: calc(50% - 1px);
            }
            #lightboard-js-up, #lightboard-js-right {
                margin-bottom: 1px;
                height: calc(50% - 1px);
            }
            .js-dir .arrow-icon {
                width: 3px;
                height: 3px;
                margin: 0 auto;
                border-color: rgba(255, 255, 255, 0.7);
                border-style: solid;
                border-width: 0px;
            }
            #lightboard-js-up .arrow-icon {
                border-top-width: 1px;
                border-left-width: 1px;
            }
            #lightboard-js-right .arrow-icon {
                border-top-width: 1px;
                border-right-width: 1px;
            }
            #lightboard-js-left .arrow-icon {
                border-bottom-width: 1px;
                border-left-width: 1px;
            }
            #lightboard-js-down .arrow-icon {
                border-bottom-width: 1px;
                border-right-width: 1px;
            }
            #joystick button.js-dir:hover .arrow-icon,
            #joystick button.js-dir.pressed .arrow-icon {
                border-color: white;
            }
            #joystick button.js-dir:focus .arrow-icon {
                outline: none;
            }
            #joystick button.js-dir:active .arrow-icon,
            #joystick button.js-dir.pressed .arrow-icon {
                transform: scale(0.9);
            }
        </style>
        <iron-image src="/assets/mode/lightboard/body.svg" sizing="contain" width="[[width]]" height="[[height]]"></iron-image>
        <button id="lightboard-btn-A" class="btn" on-mousedown="_mouseDown" on-touchstart="_mouseDown" on-mouseup="_mouseUp" on-touchend="_mouseUp" on-mouseleave="_mouseUp"></button>
        <button id="lightboard-btn-B" class="btn" on-mousedown="_mouseDown" on-touchstart="_mouseDown" on-mouseup="_mouseUp" on-touchend="_mouseUp" on-mouseleave="_mouseUp"></button>
        <kano-bitmap-renderer id="led-matrix" bitmap="[[bitmap]]" width="16" height="8" pixel-size="25" spacing="1" loop=""></kano-bitmap-renderer>
        <div id="joystick">
            <button id="lightboard-js-up" class="js-dir" on-mousedown="_mouseDown" on-touchstart="_mouseDown" on-mouseup="_mouseUp" on-touchend="_mouseUp" on-mouseleave="_mouseUp">
                <div class="arrow-icon"></div>
            </button>
            <button id="lightboard-js-right" class="js-dir" on-mousedown="_mouseDown" on-touchstart="_mouseDown" on-mouseup="_mouseUp" on-touchend="_mouseUp" on-mouseleave="_mouseUp">
                <div class="arrow-icon"></div>
            </button>
            <button id="lightboard-js-left" class="js-dir" on-mousedown="_mouseDown" on-touchstart="_mouseDown" on-mouseup="_mouseUp" on-touchend="_mouseUp" on-mouseleave="_mouseUp">
                <div class="arrow-icon"></div>
            </button>
            <button id="lightboard-js-down" class="js-dir" on-mousedown="_mouseDown" on-touchstart="_mouseDown" on-mouseup="_mouseUp" on-touchend="_mouseUp" on-mouseleave="_mouseUp">
                <div class="arrow-icon"></div>
            </button>
        </div>
        <slot></slot>
`,

  is: 'kano-workspace-lightboard',

  behaviors: [
      WorkspaceBehavior,
      lightboard,
      AppElementRegistryBehavior
  ],

  properties: {
      keyMap: {
          type: Object,
          value: () => {
              return {
                  'ArrowLeft': 'js-left',
                  'ArrowUp': 'js-up',
                  'ArrowRight': 'js-right',
                  'ArrowDown': 'js-down',
                  'a': 'btn-A',
                  'b': 'btn-B',
                  's': 'btn-B'
              };
          }
      }
  },

  ready () {
      let bitmap = [];
      for (let i = 0; i < 128; i++) {
          bitmap.push("#000000");
      }
      this.set('bitmap', bitmap);
  },

  attached () {
      this._onKeyDown = this._onKeyDown.bind(this);
      this._onKeyUp = this._onKeyUp.bind(this);

      this._keysDown = {};

      this.onIronSignal = this.onIronSignal.bind(this);
      document.addEventListener('iron-signal', this.onIronSignal);
      document.body.addEventListener('keydown', this._onKeyDown);
      document.body.addEventListener('keyup', this._onKeyUp);
      window.addEventListener('blur', this._stopSimulation);

      this._registerElement('lightboard-joystick', this.$.joystick);
      this._registerElement('lightboard-button-A', this.$['lightboard-btn-A']);
      this._registerElement('lightboard-button-B', this.$['lightboard-btn-B']);
  },

  detached () {
      document.removeEventListener('iron-signal', this.onIronSignal);
      document.body.removeEventListener('keydown', this._onKeyDown);
      document.body.removeEventListener('keyup', this._onKeyUp);
      window.removeEventListener('blur', this._stopSimulation);
  },

  render (bitmap) {
      this.bitmap = bitmap;
  },

  _mouseDown (e) {
      if (e.type === 'touchstart') {
          e.stopPropagation();
      }
      let target = e.currentTarget.id;
      target = target.replace('lightboard-', '');
      if (this._keysDown[target]) {
          return;
      }
      this._keysDown[target] = true;

      this._buttonDown({ 'button-id': target });
      this._simulatePressed(target);
  },

  _mouseUp (e) {
      if (e.type === 'touchend') {
          e.stopPropagation();
      }
      let target = e.currentTarget.id;
      target = target.replace('lightboard-', '');

      this._keysDown[target] = false;

      this._buttonUp({ 'button-id': target });
      this._simulateReleased(target);
  },

  _onKeyDown (e) {
      let target = this.keyMap[e.key];

      if (!target || this._keysDown[target]) {
          return;
      }

      this._keysDown[target] = true;

      this._buttonDown({ 'button-id': target });
      this._simulatePressed(target);
  },

  _onKeyUp (e) {
      let target = this.keyMap[e.key];

      if (!target) {
          return;
      }

      this._keysDown[target] = false;

      this._buttonUp({ 'button-id': target });
      this._simulateReleased(target);
  },

  onIronSignal (e) {
      if (e.detail && e.data && e.detail.name === 'remove-shape') {
          this._removeShape(e);
      }
  },

  _simulatePressed (target) {
      let id = 'lightboard-' + target;
      this.$[id].classList.add('pressed');
      if (this.isJoystick(target)) {
          this.$.joystick.classList.add('pressed');
      }
  },

  _simulateReleased (target) {
      let id = 'lightboard-' + target;
      this.$[id].classList.remove('pressed');
      if (this.isJoystick(target)) {
          this.$.joystick.classList.remove('pressed');
      }
  },

  stop () {
      lightboard.stop.apply(this);
      this.reset();
  },

  reset () {
      this.clear();
  },

  getRestrictElement () {
      return this.$['led-matrix'];
  },

  renderOnCanvas (ctx, util, scaleFactor) {
      let bitmap = this.getBitmap(),
          pxSize = 21,
          paintLeds, hsl, x, y;

      return Promise.all([
          this.loadImage('/assets/mode/lightboard/body.svg'),
          this.loadImage('/assets/mode/lightboard/led.svg')
      ]).then(images => {
          let body = images[0],
              led = images[1],
              pixel;
          ctx.drawImage(body, 0, 0, 466, 322);
          ctx.save();
          for (let i = 0, len = bitmap.length; i < len; i++) {
              pixel = bitmap[i];
              x = 21 + ((i % 16) * (pxSize + 6));
              y = 46 + (Math.floor(i / 16) * (pxSize + 6));
              hsl = this.hexToRgb(pixel);
              hsl = this.rgbToHsl(hsl.r, hsl.g, hsl.b);
              ctx.globalAlpha = 1;
              ctx.shadowBlur = 0;
              ctx.drawImage(led, x, y, pxSize, pxSize);
              ctx.shadowBlur = hsl.l * 20;
              ctx.fillStyle = pixel;
              ctx.shadowColor = pixel;
              ctx.globalAlpha = hsl.l;
              ctx.fillRect(x, y, pxSize, pxSize);
          }
          ctx.restore();
      });
  },

  loadImage (src) {
      return new Promise((resolve, reject) => {
          let img = new Image();
          img.onload = () => {
              resolve(img);
          };
          img.onerror = reject;
          img.src = src;
      });
  }
});
