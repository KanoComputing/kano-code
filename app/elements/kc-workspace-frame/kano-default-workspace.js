import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-icon/iron-icon.js';
import '@kano/polymer-sortablejs/polymer-sortablejs.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../ui/kano-ui-viewport/kano-ui-viewport.js';
import '../kano-icons/kc-ui.js';
import '../kano-workspace-toolbar/kano-workspace-toolbar.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import { AppEditorBehavior } from '../behaviors/kano-app-editor-behavior.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { Utils } from '../../scripts/kano/make-apps/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            :host(.fullscreen) #content {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 301;
                margin: 0;
            }
            :host #content {
                position: relative;
                width: auto;
                margin-top: 14px;
                transition: background linear 150ms;
            }
            :host.running #content {
                --kano-ui-viewport: {
                    border: none;
                };
            }
            .pause-overlay {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                @apply(--layout-vertical);
                @apply(--layout-center);
                @apply(--layout-center-justified);
            }
            .pause-overlay iron-image {
                width: 40%;
                height: 40%;
                cursor: pointer;
            }
            #workspace-placeholder {
                height: 100%;
            }
            #workspace-placeholder>* {
                animation: fade-in 200ms linear;
            }
            kano-workspace-toolbar {
                padding: 20px 0;
            }
            .controls {
                @apply --layout-vertical;
                @apply --layout-justified;
                @apply --layout-flex-auto;
                box-sizing: border-box;
            }
            :host(:not(.fullscreen)) .overlay {
                display: none;
            }
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 300;
                background: var(--kano-app-editor-workspace-background, #f2f2f2);
            }
            .overlay kano-workspace-toolbar {
                position: absolute;
                bottom: 0px;
                width: 100%;
            }
            button#fullscreen-close {
                @apply --layout-self-end;
                @apply --kano-button;
                background: rgba(255, 255, 255, 0.25);
                color: rgba(255, 255, 255, 0.75);
                border-radius: 3px;
            }
            button#fullscreen-close {
                position: fixed;
                top: 16px;
                right: 16px;
                padding: 6px;
            }
            button>* {
                margin: 0 auto;
            }
            button#fullscreen-close:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            paper-dialog {
                background: transparent;
            }
            iron-icon {
                --iron-icon-width: 27px;
                --iron-icon-height: 27px;
                --iron-icon-fill-color: #8F9195;
            }
            button#fullscreen-close iron-icon {
                fill: rgba(255, 255, 255, 0.75);
            }
            button#fullscreen-close:hover iron-icon {
                fill: rgba(255, 255, 255, 1);
            }
            button#fullscreen-close iron-icon {
                --iron-icon-width: 20px;
                --iron-icon-height: 20px;
            }
            .handle {
                cursor: move;
            }
            button.remove {
                background: inherit;
                cursor: pointer;
                line-height: 0;
                border: 0;
                padding: 0;
            }
            .remove:hover iron-icon {
                fill: var(--color-rhubarb);
            }
            iron-icon.handle:hover {
                fill: #fff;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <kano-ui-viewport id="content" mode="scaled" view-width="[[width]]" view-height="[[height]]">
            <div id="workspace-placeholder">
                <slot name="workspace"></slot>
            </div>
        </kano-ui-viewport>
        <div class="controls">
            <kano-workspace-toolbar running="[[running]]" no-part-controls="" show-settings="" on-pause-run-button-clicked="_runButtonClicked" on-fullscreen-button-clicked="_toggleFullscreen" on-restart-button-clicked="_resetAppState" show-mouse-position="[[showMousePosition]]" mouse-x="[[mouseX]]" mouse-y="[[mouseY]]" fullscreen="[[fullscreen]]"></kano-workspace-toolbar>
            <slot name="controls"></slot>
        </div>
        <div class="overlay">
            <button id="fullscreen-close" on-tap="_toggleFullscreen">
                <iron-icon icon="kc-ui:close"></iron-icon>
            </button>
            <kano-workspace-toolbar running="[[running]]" no-part-controls="" on-save-button-clicked="_toggleFullscreen" on-pause-run-button-clicked="_runButtonClicked" on-fullscreen-button-clicked="_toggleFullscreen" on-restart-button-clicked="_resetAppState" fullscreen="[[fullscreen]]"></kano-workspace-toolbar>
        </div>
        <iron-a11y-keys keys="meta+enter" on-keys-pressed="_goFullscreen" target="[[target]]"></iron-a11y-keys>
        <iron-a11y-keys keys="esc" on-keys-pressed="_cancelFullscreen" target="[[target]]"></iron-a11y-keys>
`,

  is:'kano-default-workspace',

  behaviors: [
      I18nBehavior,
      AppEditorBehavior,
      AppElementRegistryBehavior,
      IronResizableBehavior,
  ],

  properties: {
      running: {
          type: Boolean,
          value: false,
          notify: true
      },
      width: {
          type: Number
      },
      height: {
          type: Number
      },
      mouseX: {
          type: Number,
          value: 0
      },
      mouseY: {
          type: Number,
          value: 0
      },
      showMousePosition: {
          type: Boolean,
          value: false
      },
      noPlayerBar: {
          type: Boolean
      },
      fullscreen: {
          type: Boolean,
          value: false
      },
  },

  listeners: {
      'iron-resize': '_setViewportHeight'
  },

  _setViewportHeight () {
      window.requestAnimationFrame(() => {
          let aspectRatio = this.height / this.width,
              style = this.$.content.style;
          if (this.fullscreen) {
              // Portrait
              if (window.innerHeight > window.innerWidth * aspectRatio) {
                  style.width = '70vw';
                  style.height = `calc(70vw * ${aspectRatio})`;
                  style.top = `calc(50% - (70vw * ${aspectRatio} / 2))`;
                  style.left = `calc(50% - 35vw)`;
              } else {
                  // Landscape
                  aspectRatio = 1 / aspectRatio;
                  style.height = '70vh';
                  style.width = `calc(70vh * ${aspectRatio})`;
                  style.top = `calc(50% - 35vh)`;
                  style.left = `calc(50% - (70vh * ${aspectRatio} / 2))`;
              }
          } else {
              //We are not fullscreen so set the viewport height relative to the width of the workspace
              style.width = 'auto';
              style.height = `${this.offsetWidth * aspectRatio}px`;
              style.top = 'auto';
              style.left = 'auto';

          }
      });
      this.$.content.resizeView();
  },

  attached () {
      this.target = document.body;
      this._registerElement('parts-controls', this);
  },

  _goFullscreen () {
      if (!this.fullscreen) {
          this._toggleFullscreen();
      }
  },

  _cancelFullscreen () {
      if (this.fullscreen) {
          this._toggleFullscreen();
      }
  },

  _toggleFullscreen () {
      this.toggleClass('fullscreen');
      this.fire('tracking-event', {
          name: 'app_size_toggled',
          data: {
              size: this.fullscreen ? 'normal' : 'fullscreen'
          }
      });
      this.fullscreen = !this.fullscreen;
      this._setViewportHeight();

      Utils.triggerResize();
  },

  _resetAppState () {
      this.fire('reset-app-state');
  },

  _runButtonClicked () {
      this.fire('run-button-clicked');
  },

  getViewportScale () {
      return this.$.content.getScale();
  }
});
