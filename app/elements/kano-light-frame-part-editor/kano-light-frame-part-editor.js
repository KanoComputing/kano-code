import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import '../kano-part-editor-topbar/kano-part-editor-topbar.js';
import '../kano-pixel-editor/kano-pixel-editor.js';
import '../kano-pixel-canvas/kano-pixel-canvas.js';
import { LightBitmapBehavior } from '../behaviors/kano-light-bitmap-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { LightFrame } from '../../scripts/kano/make-apps/parts-api/light-frame.js';

Polymer({
    _template: html`
        <style>
            :host {
                display: block;
            }
            .settings {
                @apply --layout-vertical;
                @apply --layout-flex-auto;
            }
            .settings-controls {
                @apply --layout-flex-auto;
                @apply --layout-vertical;
            }
            .settings-controls>* {
                margin-bottom: 18px;
            }
            kano-pixel-editor {
                --kano-pixel-editor-bitmap-container: {
                    height: 364px;
                };
            }
            kano-pixel-canvas {
                @apply --layout-flex-auto;
                cursor: none;
                --kano-pixel-editor-background: var(--color-dark);
            }
        </style>
        <kano-part-editor-topbar icon="light-frame" label="[[selected.label]]" theme="[[theme]]"></kano-part-editor-topbar>
        <kano-pixel-editor id="pixel-editor" bitmap="{{selected.userProperties.bitmap}}" width="{{selected.userProperties.width}}" height="{{selected.userProperties.height}}" pen-color="{{penColor}}" pen-type="{{penType}}">
            <div slot="bitmap">
                <kano-pixel-canvas id="canvas" bitmap="{{selected.userProperties.bitmap}}" width="[[selected.userProperties.width]]" height="[[selected.userProperties.height]]" pixel-size="22" spacing="1" pen-color="[[penColor]]" pen-type="[[penType]]"></kano-pixel-canvas>
            </div>
            <div slot="settings" class="settings">
                <div class="settings-controls">
                    <kano-input-text value="{{name}}" theme="[[theme]]"></kano-input-text>
                    <kano-input-range id="width-slider" class="slider" value="{{selected.userProperties.width}}" label="Width" min="1" max="16" theme="[[theme]]"></kano-input-range>
                    <kano-input-range id="height-slider" class="slider" value="{{selected.userProperties.height}}" label="Height" min="1" max="8" theme="[[theme]]"></kano-input-range>
                </div>
            </div>
        </kano-pixel-editor>
`,

    is: 'kano-light-frame-part-editor',

    behaviors: [
        LightFrame,
        LightBitmapBehavior,
        Store.ReceiverBehavior,
    ],

    properties: {
        selected: {
            type: Object,
            notify: true,
        },
        theme: {
            type: String,
            value: '#00d9c7',
        },
        penColor: String,
        penType: String,
        name: {
            type: String,
            notify: true,
        },
    },

    observers: [
        '_onBitmapSet(selected.userProperties.bitmap)',
        '_onBitmapChanged(selected.userProperties.bitmap.*)',
        '_sizeChanged(selected.userProperties.width, selected.userProperties.height)',
        '_renderOnRealDevice(selected.userProperties.bitmap.*)',
    ],

    attached() {
        this.BOARD_WIDTH = 16;
        this.BOARD_HEIGHT = 8;
    },

    detached() {
        this.appModule.stop();
    },

    _onBitmapSet(bitmap) {
        // When bitmap is set, ask pixel-editor to compute the custom palette.
        if (!this.colorsComputed) {
            this.$['pixel-editor']._computePalette(bitmap);
            this.colorsComputed = true;
        }
    },

    _onBitmapChanged(e) {
        // Lock observer as it's resetting the observed property
        if (this.lock) {
            return;
        }
        this.lock = true;
        this.async(() => this.lock = false);

        if (e.path.search(/splices/) !== -1) {
            this._setBitmap();
        }
    },

    _setBitmap() {
        const props = this.selected.userProperties;
        this.set('storedBitmap', this._adjustForStorage(props.bitmap, props.width));
        this.set('selected.userProperties.bitmap', this._adjustForDisplay(this.storedBitmap, props.width, props.height));
    },

    _sizeChanged() {
        const props = this.selected.userProperties;
        this.storedBitmap = this.storedBitmap || this._adjustForStorage(props.bitmap, props.width);
        this.set('selected.userProperties.bitmap', this._adjustForDisplay(this.storedBitmap, props.width, props.height));
    },

    _renderOnRealDevice() {
      if (!this.deviceRendering) {
          const hw = Kano.AppModules.modules.lightboard.api;
          const state = this.getState();
          this.appModule = Kano.AppModules.createStandalone();
          this.appModule.config(Object.assign({}, state.config, { hardwareAPI: hw }));
          this.appModule.start();
          this.deviceRendering = true;
      }

      try {
          this.async(() => this.appModule.getModule('lightboard').updateOrCreateShape('drawing', this.getShape(), () => {}));
      }
      catch (e) {
         
      }
  },

    getShape() {
        this.model = this.selected;
        return {
            id: 'being-edited',
            x: this.getX(),
            y: this.getY(),
            width: this.getWidth(),
            height: this.getHeight(),
            visible: true,
            bitmap: this.selected.userProperties.bitmap,
            type: 'frame',
        };
    },
});
