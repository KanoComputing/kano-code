import '../../scripts/kano/make-apps/experiments.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import '../msg/en-US.js';
import '../play-bundle.js';
import '../kano-style/themes/dark.js';
import '../kano-icons/kc-ui.js';
import '../kano-animated-svg/kano-animated-svg.js';
import '../../scripts/kano/make-apps/blockly/blockly.js';
import '../../scripts/config/development.js';
import { Utils } from '../../scripts/kano/make-apps/utils.js';
import '../kc-blockly-editor/kc-blockly-editor.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '../../../../../iron-lazy-pages/iron-lazy-pages.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { BlockAnimation } from '../../scripts/splash.js'
/**

`kc-code-snippet` is a mini KC environment contained within a single component.
It reads a kcode file and shows its content using a minimal Blockly workspace
and UI component.

Example:
    <kc-code-snippet kcode-url=""></kc-code-snippet>

 The following custom properties and mixins are also available for styling:

@group Kano Elements
@hero hero.svg
@demo ./demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
Polymer({
  _template: html`
        <style>
            :host {
                display: flex;
                border-radius: 5px;
            }
            .snippet {
                @apply --layout-horizontal;
                @apply --layout-wrap;

                position: relative;
            }

            #root-view {
                @apply --layout-self-stretch;
                @apply --layout-flex;
            }

            #viewport {
                @apply --layout-flex;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                overflow: hidden;
            }

            #root-view {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
                overflow: hidden;
            }

            #root-view, #viewport {
                min-width: 400px;
                height: 300px;
            }

            .controls {
                @apply --layout-horizontal;
                position: absolute;
                bottom: 10px;
                right: 7px
            }
            kano-animated-svg {
                min-width: 17px;
                min-height: 17px;
                margin: 8px 5px 6px 7px;

                --kano-animated-path: {
                    fill: #ccc;
                    stroke: #ccc;
                    stroke-width: 2px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    transition: all ease-in-out 200ms;
                }
            }
            .controls button {
                border: none;
                background: #eaeaea;
                border-radius: 5px;
                overflow: none;
                cursor: pointer;
                outline: none;
                margin: 0px 3px;
            }
            .controls button:hover {
                opacity: 0.7;
            }
            .controls .reset-icon {
                fill: #ccc;
                stroke: #ccc;
                margin: 8px;
                --iron-icon-width: 17px;
                --iron-icon-height: 17px;
            }
            kano-workspace-lightboard {
                background-color: #fff;
            }
            .loading {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--kwc-blockly-background, white);
                color: #fff;
                @apply --kano-font;

                @apply --layout-vertical;
                @apply --layout-center-justified;

                font-family: var(--font-body);

                transition: opacity 300ms ease-in-out;

                border-radius: 5px;
            }
            .loading-done {
                display: none;
            }
            .loading .text {
                @apply --layout-self-center;
            }

            /* Splash animation style
             * @see scripts/splash.js
             */
            .blocks {
                width: 80px;
                height: 80px;

                display: flex;
                flex-direction: column;

                animation: fade-in .3s;
                transition-timing-function: ease-in;
            }

            .line {
                width: 100%;

                transform-origin: center;

                display: flex;
            }

            .block {
                opacity: 1;
                border-radius: 1px;

                background-color: rgba(0,0,0,0.5);

                margin: 2px;
                width: 10px;
                height: 8px;
            }
        </style>
        <div class="snippet">
            <kc-blockly-editor id="root-view" parts="{{parts}}" code="{{code}}" mode="[[mode]]" default-categories="{{defaultCategories}}" simple="true">
            </kc-blockly-editor>
            <kano-ui-viewport id="viewport" mode="scaled" view-width="[[mode.workspace.viewport.width]]" view-height="[[mode.workspace.viewport.height]]" no-overflow="" centered="">
                <iron-lazy-pages selected="[[mode.workspace.component]]" attr-for-selected="data-route" hide-immediately="">
                    <template is="dom-if" data-route="kano-workspace-normal" restamp="">
                        <kano-workspace-normal id="workspace" class="dropzone" width="[[mode.workspace.viewport.width]]" height="[[mode.workspace.viewport.height]]" running="[[running]]" editable-layout="false" parts-menu-open="false" parts="{{parts}}">
                        </kano-workspace-normal>
                    </template>
                    <template is="dom-if" data-route="kano-workspace-lightboard" restamp="">
                        <kano-workspace-lightboard id="workspace" class="dropzone" width="[[mode.workspace.viewport.width]]" height="[[mode.workspace.viewport.height]]" running="[[running]]" editable-layout="false" parts-menu-open="false" parts="{{parts}}">
                        </kano-workspace-lightboard>
                    </template>
                </iron-lazy-pages>
            </kano-ui-viewport>
            <div class="controls">
                <button on-tap="_resetButtonClicked">
                    <iron-icon class="reset-icon" icon="kc-ui:reset">
                    </iron-icon>
                </button>
                <button on-tap="_playButtonClicked">
                    <kano-animated-svg width="19" height="21" paths="[[makeButtonIconPaths]]" selected="{{_getRunningStatus(running)}}">
                    </kano-animated-svg>
                </button>
            </div>
            <div id="loading" class="loading" hidden\$="[[!loading]]">
                <div id="spinner" class="text"></div>
            </div>
        </div>
`,

  is: 'kc-code-snippet',
  behaviors: [Store.ReceiverBehavior],

  properties: {
      running: {
          type: Boolean
      },
      parts: {
          type: Array,
          value: []
      },
      mode: {
          type: Object
      },
      code: {
          type: Object,
          value: {
              snapshot: {}
          }
      },
      running: {
          type: Boolean,
          value: false
      },
      defaultCategories: {
          type: Object,
          value: null
      },
      kcodeUrl: {
          type: String
      }
  },

  listeners: {},

  observers: [
      '_reRunCode(running, code.snapshot.javascript)',
      'loadFromURL(kcodeUrl)'
  ],

  ready () {
      const { config } = this.getState();
      this.makeButtonIconPaths = {
          stopped: 'M 4,18 10.5,14 10.5,6 4,2 z M 10.5,14 17,10 17,10 10.5,6 z',
          running: 'M 2,18 6,18 6,2 2,2 z M 11,18 15,18 15,2 11,2 z'
      };

      /* These functions have guards that prevent them
       * from being called twice.
       */
      Parts.init(config);
      Kano.MakeApps.Blockly.register(window.Blockly);

      /* Start the splash animation */
      this.splash = new BlockAnimation(this.$.spinner);
      this.splash.init();
  },

  loadFromURL (url) {
      fetch(url)
          .then((res) => {
              return res.text();
          }).then((kcode) => {
              this.loadFromKcode(kcode);
          }).catch((err) => {
              console.error(err);
          });
  },

  loadFromKcode (kcodeString) {
      const { config } = this.getState();
      let kcode = JSON.parse(kcodeString),
          hwAPI = new Kano.MakeApps.HardwareAPI(config),
          addedParts,
          workspace;

      /* Keep the .kcode file for reloading the snipped. */
      this.kcode = kcode;

      this.set('defaultCategories', Kano.MakeApps.Blockly.categories);
      this.set('mode', Kano.MakeApps.Mode.modes[kcode.mode]);

      this.appModules = Kano.AppModules.createStandalone();
      this.appModules.init(Object.assign({
          hardwareAPI: hwAPI
      }, config));

      this._loadParts(kcode.parts);
      hwAPI.setParts(this.parts);

      workspace = this.$$('#workspace');

      /* Configure the workspace.
       * We set the background colour of the workspace to fill
       * the rest of the parent around it too.
       */
      workspace.appModules = this.appModules;
      if (workspace.setBackground) {
          workspace.setBackground(kcode.background.userStyle.background);
          this.$.viewport.style.background = kcode.background.userStyle.background;
      }

      this._updatePartsColors();

      /* Wait until blockly is properly initialised */
      this.async(() => {
          this.set('code', Object.assign({}, this.kcode.code));
          this.resetView();
          this.running = true;

          /* Fade the overlay out */
          this.async(() => {
              this.$.loading.style.opacity = '0';

              /* display: none on the overlay */
              this.async(() => {
                  this.splash.cancel();
                  this.$.loading.classList.add('loading-done');
              }, 300);
          }, 100);
      }, 500);

  },

  _loadParts (partsFromKcode) {
      let parts = Parts.list,
          addedParts,
          part,
          workspace = this.$$('#workspace'),
          partsObj = {
              lightboard: workspace
          };

      addedParts = partsFromKcode.map((savedPart) => {
          for (let i = 0, len = parts.length; i < len; i++) {
              if (parts[i].type === savedPart.type) {
                  savedPart = Object.assign({}, parts[i], savedPart);
                  break;
              }
          }
          part = Parts.create(
              savedPart,
              this.mode.workspace.viewport
          );
          return part;
      });

      this.set('parts', addedParts);

      this.parts.forEach((model) => {
          part = document.createElement(model.tagName);
          part.setAttribute('id', model.id);
          part.model = model;
          part.appModules = this.appModules;

          workspace.appendChild(part);
          partsObj[model.id] = part;
      });

      this.appModules.loadParts(partsObj);

  },

  _reRunCode (running) {
      if (!this.appModules) {
          return;
      }

      if (running) {
          this.debounce('rerun', () => {

              this.appModules.stop();

              let appCode = this.appModules.createAppCode('AppModules', this.code.snapshot.javascript),
                  vm;

              this.appModules.start();
              vm = new Kano.VM({ AppModules: this.appModules });
              vm.runInContext(appCode);
          });
      } else {
          this.appModules.stop();
      }
  },

  _updatePartsColors () {
      if (!this.defaultCategories) {
          return;
      }

      this.debounce('updatePartsColors', () => {
          Utils.updatePartsColors(this.parts);
      }, 10);
  },

  _onBlocklyReady () {
      this.resetView();
  },

  resetView () {
      this.debounce('reset-view', () => {
          this.$['root-view'].getBlocklyWorkspace().scrollCenter();
      }, 100);
  },

  attached () {
      window.addEventListener('resize', this.resetView.bind(this));
  },

  detached () {
      window.addEventListener('resize', this.resetView.bind(this));
  },

  _resetButtonClicked () {
      this.set('code', Object.assign({}, this.kcode.code));
      this.resetView();
      this.running = true;
  },

  _playButtonClicked () {
      this.running = !this.running;
  },

  _getRunningStatus (running) {
      return running ? 'running' : 'stopped';
  }
});
