import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import '../kano-part-editor-topbar/kano-part-editor-topbar.js';
import '../kano-animated-svg/kano-animated-svg.js';
import '../kano-light-animation-editor/kano-light-animation-editor.js';
import '../kano-icons/kc-ui.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { LightAnimation } from '../../scripts/kano/make-apps/parts-api/light-animation.js';
/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            .action-control {
                @apply --layout-flex-auto;
                @apply --layout-horizontal;
                @apply --layout-end-justified;
            }
            .action-control button {
                @apply --kano-button;
                background: #54595d;
                border-radius: 3px;
                padding: 0;
                margin-right: 12px;
            }
            #reverse, #preview-button {
                padding: 2px 10px;
            }
            .action-control button:hover {
                background-color: #00d9c7;
            }
            .action-control button iron-icon {
                --iron-icon-height: 28px;
                --iron-icon-width: 28px;
                fill: #8f9195;
                transition: fill 300ms;
            }
            .action-control button:hover iron-icon {
                fill: #fff;
            }
            .action-control button kano-animated-svg {
                width: 28px;
                height: 28px;
                fill: #8f9195;
                transition: fill ease-in-out 300ms;
                margin: 0 auto;
            }
            .action-control button:hover kano-animated-svg {
                fill: #fff;
            }
            kano-light-animation-editor {
                width: 880px;
            }
        </style>
        <kano-part-editor-topbar icon="light-animation" label="Animation" theme="#00d9c7">
            <div class="action-control" slot="action">
                <button id="reverse" type="button" on-tap="_resetPreview">
                    <iron-icon icon="kc-ui:restart"></iron-icon>
                </button>
                <button id="preview-button" type="button" on-tap="_togglePreviewState">
                    <kano-animated-svg width="64" height="64" paths="[[previewButtonIconPaths]]" selected="[[_computeControlIcon(running)]]"></kano-animated-svg>
                </button>
            </div>
        </kano-part-editor-topbar>
        <kano-light-animation-editor id="editor" label="{{name}}" width="{{selected.userProperties.width}}" height="{{selected.userProperties.height}}" bitmaps="{{selected.userProperties.bitmaps}}" speed="{{selected.userProperties.speed}}" running="{{running}}" on-render-frame="_renderOnRealDevice"></kano-light-animation-editor>
`,

  is: 'kano-light-animation-part-editor',

  behaviors: [
      LightAnimation,
      AppElementRegistryBehavior,
      Store.ReceiverBehavior,
  ],

  properties: {
      selected: {
          type: Object,
          notify: true
      },
      theme: String,
      running: Boolean,
      name: {
          type: String,
          notify: true
      }
  },

  attached () {
      this.BOARD_WIDTH = 16;
      this.BOARD_HEIGHT = 8;
      this.previewButtonIconPaths = {
          stopped: 'M45.69,32.1a2.24,2.24,0,0,1-1.16,2L21.77,47.41a1.4,1.4,0,0,1-1.51,0,1.34,1.34,0,0,1-.74-1.33v-28a1.34,1.34,0,0,1,.74-1.33,1.4,1.4,0,0,1,1.51,0L44.54,30.06A2.24,2.24,0,0,1,45.69,32.1Z',
          running: 'M23.34,46a2.43,2.43,0,0,1-1.9-.78,2.69,2.69,0,0,1-.78-1.93V20.71a2.69,2.69,0,0,1,.78-1.93,2.44,2.44,0,0,1,1.9-.78h3.74a2.44,2.44,0,0,1,1.9.78,2.69,2.69,0,0,1,.78,1.93V43.24A2.69,2.69,0,0,1,29,45.17a2.43,2.43,0,0,1-1.9.78Zm13.51,0a2.49,2.49,0,0,1-1.9-.78,2.63,2.63,0,0,1-.81-1.93V20.71a2.63,2.63,0,0,1,.81-1.93,2.49,2.49,0,0,1,1.9-.78h3.74a2.43,2.43,0,0,1,1.9.78,2.69,2.69,0,0,1,.78,1.93V43.24a2.69,2.69,0,0,1-.78,1.93,2.43,2.43,0,0,1-1.9.78Z'
      };

      this.async(() => {
          editorElements = this.$.editor.getElementsRegistry();
          this._registerElement('animation-editor', this.$.editor);
          this._registerElement('animation-editor-preview-button', this.$['preview-button']);
          this._registerElement('animation-editor-width-slider', editorElements['width-slider']);
          this._registerElement('animation-editor-height-slider', editorElements['height-slider']);
          this._registerElement('animation-editor-speed-slider', editorElements['speed-slider']);
          this._registerElement('animation-editor-canvas', editorElements['canvas']);
          this._registerElement('animation-editor-add-frame-button', editorElements['add-frame-button']);
          this._registerElement('animation-editor-frames', editorElements['frames']);
          this._registerElement('animation-editor-palette', editorElements['palette']);
          this._registerElement('animation-editor-draw-button', editorElements['draw-button']);
          this._registerElement('animation-editor-fill-button', editorElements['fill-button']);
          this._registerElement('animation-editor-colors', editorElements['colors']);
          this._registerElement('animation-editor-add-color-button', editorElements['add-color-button']);
          this._registerElement('animation-editor-color-wheel', editorElements['color-wheel']);
      });
  },

  detached () {
      this.appModule.stop();
  },

  _computeControlIcon (running) {
      return running ? 'running' : 'stopped';
  },

  _resetPreview () {
      this.$.editor._resetPreview();
  },

  _togglePreviewState () {
      this.$.editor._togglePreviewState();
  },

  _renderOnRealDevice (e) {
      const frame = e.detail;
      if (!this.deviceRendering) {
          const state = this.getState();
          const hw = Kano.AppModules.modules.lightboard.api;
          this.appModule = Kano.AppModules.createStandalone();
          this.appModule.config(Object.assign({}, state.config, { hardwareAPI: hw }));
          this.appModule.start();
          this.deviceRendering = true;
      }
      try {
          this.async(() => this.appModule.getModule('lightboard').updateOrCreateShape('drawing', this.getShape(frame), () => {}));
      }
      catch (e) {
         return;
      }
  },

  getShape (frame) {
      this.model = this.selected;
      return {
          id: 'being-edited',
          x: this.getX(),
          y: this.getY(),
          width: this.getWidth(),
          height: this.getHeight(),
          visible: true,
          bitmap: frame,
          type: 'frame'
      }
  }
});
