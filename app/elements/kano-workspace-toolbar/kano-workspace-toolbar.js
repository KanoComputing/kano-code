import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '../kano-animated-svg/kano-animated-svg.js';
import '../kano-tooltip/kano-tooltip.js';
import '../kano-icons/kc-ui.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import '../inline-controls/kano-value-rendering/kano-value-rendering.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            :host([show-settings]) {
                @apply --layout-end-justified;
            }
            :host>div {
                @apply --layout-horizontal;
            }
            .fullscreen,
            .pause {
                border-right: 2px solid #eee;
            }
            .mouse-position {
                @apply --flex-horizontal;
                @apply --layout-end-justified;
                width: 100px;
                font-family: var(--font-body);
                font-size: 14px;
                line-height: 14px;
                font-weight: bold;
                color: #fff;
                margin-right: 12px;
            }
            .spacer {
                @apply --layout-flex;
            }
            button#settings {
                margin: 0 8px 0 0;
            }
            kano-animated-svg {
                min-width: 17px;
                min-height: 17px;

                --kano-animated-path: {
                    fill: white;
                    stroke: white;
                    stroke-width: 2px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    transition: all ease-in-out 200ms;
                }
            }
            kano-tooltip {
                box-sizing: border-box;
                --kano-tooltip-caret-width: 12px;
            }
            kano-tooltip.fly {
                --kano-tooltip-caret-width: 7px;
            }
            button {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
                @apply --kano-button;
                background-color: rgba(255, 255, 255, 0.25);
                border-radius: 3px;
                padding: 10px 16px;
                cursor: pointer;
                margin: 0 8px 0 0;
                font-size: 12px;
                font-weight: normal;
                text-shadow: none;
                font-family: var(--font-body);
            }
            button:hover,
            button:focus {
                background-color: var(--color-orange);
                outline: none;
            }
            button.square {
                width: 32px;
                height: 32px;
                padding: 0px;
                cursor: pointer;
            }
            button.square>* {
                margin: 0 auto;
            }
            button span.x {
                display: none;
            }
            button.open span.x {
                display: inline-block;
                transform: translate(0px, -2px);
            }
            button#play {
                margin: 0;
            }
            iron-icon {
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
                opacity: 0.75;
            }
            button:hover iron-icon,
            button:focus iron-icon {
                opacity: 1;
            }
            button#save iron-icon {
                --iron-icon-fill-color: #fff;
            }
            ul {
                min-width: 188px;
                margin: 0px;
                padding: 10px 0 8px;
                color: black;
            }
            li {
                @apply --layout-vertical;
                @apply --layout-stretch;
            }
            .inline {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-start-justified;
                cursor: pointer;
                opacity: 0.9;
                background: transparent;
                margin: 0;
                transition: none;
                border-radius: 0px;
            }
            .text {
                color: var(--color-chateau);
                text-transform: initial;
                font-size: 14px;
                font-family: var(--font-body);
                text-decoration: none;
                padding: 6px 12px;
            }
            ul li .inline:hover,
            ul li .inline:focus {
                opacity: 1;
                background: rgba(0, 0, 0, 0.10);
            }
            ul li .inline iron-icon {
                --iron-icon-width: 20px;
                --iron-icon-height: 20px;
                margin-right: 14px;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <button id="settings" type="button" class="square settings" hidden\$="[[!showSettings]]" on-tap="_openSettings">
            <iron-icon icon="kc-ui:settings"></iron-icon>
        </button>
        <kano-tooltip id="save-tooltip" class="fly" position="top" offset="16"><div class="text">Save</div></kano-tooltip>
        <button id="save" type="button" class="square" on-tap="_save" on-mouseenter="_startTimer" on-mouseleave="_stopTimer">
            <iron-icon icon="kc-ui:save"></iron-icon>
        </button>
        <div class="spacer" hidden\$="[[!showSettings]]"></div>

        <div class="mouse-position" hidden\$="[[mousePositionHidden(showMousePosition)]]">
            <span>x:</span>
            <kano-value-rendering font="bold 24px Bariol" width="32" height="16" value="{{mouseX}}" text-align="end" offset-x="25"></kano-value-rendering>
            <span>, y:</span>
            <kano-value-rendering font="bold 24px Bariol" width="32" height="16" value="{{mouseY}}" text-align="end" offset-x="25"></kano-value-rendering>
        </div>
        <div class="part-controls" hidden\$="[[noPartControls]]">
            <button id="add-part-button" class\$="{{_applyButtonClass(partsMenuOpen)}}" on-tap="_togglePartsMenu">
                <span>{{_computePartsMenuButtonLabel(partsMenuOpen)}}</span>
                <span class="x">&nbsp;×</span>
            </button>
            <button id="edit-layout-button" class\$="{{_applyButtonClass(editableLayout)}}" on-tap="_editLayoutClicked">
                <span>[[_computeEditingButtonLabel(editableLayout)]]</span>
                <span class="x">&nbsp;×</span>
            </button>
        </div>
        <div class="player-bar" hidden\$="[[noPlayerBar]]">
            <kano-tooltip id="fullscreen-tooltip" class="fly" position="top" offset="16"><div class="text">[[localize('FULLSCREEN', 'Fullscreen')]]</div></kano-tooltip>
            <button id="fullscreen" class="square" type="button" on-tap="fullscreenClicked" on-mouseenter="_startTimer" on-mouseleave="_stopTimer">
                <iron-icon icon="kc-ui:{{_getMinMaxIcon(fullscreen)}}"></iron-icon>
            </button>
            <kano-tooltip id="restart-tooltip" class="fly" position="top" offset="16"><div class="text">[[localize('RESTART', 'Restart')]]</div></kano-tooltip>
            <button id="restart" class="square" type="button" on-tap="restartClicked" on-mouseenter="_startTimer" on-mouseleave="_stopTimer">
                <iron-icon icon="kc-ui:reset"></iron-icon>
            </button>
            <kano-tooltip id="play-tooltip" class="fly" position="top" offset="16"><div class="text">[[playPauseLabel]]</div></kano-tooltip>
            <button id="play" class="square" type="button" on-tap="_runButtonClicked" on-mouseenter="_startTimer" on-mouseleave="_stopTimer">
                <kano-animated-svg width="19" height="21" paths="[[makeButtonIconPaths]]" selected="{{_getRunningStatus(running)}}"></kano-animated-svg>
            </button>
        </div>
        <kano-tooltip id="settings-tooltip" position="bottom" offset="16" auto-close="">
            <ul>
                <li>
                    <button type="button" class="inline text" on-tap="_reset">
                        <iron-icon icon="kc-ui:reset"></iron-icon>
                        <div>[[localize('RESET_WORKSPACE', 'Reset Workspace')]]</div>
                    </button>
                </li>
                <li>
                    <button type="button" class="inline text" on-tap="_export">
                        <iron-icon icon="kc-ui:export"></iron-icon>
                        <div>[[localize('EXPORT', 'Export')]]</div>
                    </button>
                </li>
                <li>
                    <button type="button" class="inline text" on-tap="_import">
                        <iron-icon icon="kc-ui:import"></iron-icon>
                        <div>[[localize('IMPORT', 'Import')]]</div>
                    </button>
                </li>
                <li>
                    <a href="https://insights.hotjar.com/s?siteId=119134&amp;surveyId=9857" target="_blank" class="inline text">
                        <iron-icon icon="kc-ui:feedback"></iron-icon>
                        <div>[[localize('GIVE_FEEDBACK', 'Give Feedback')]]</div>
                    </a>
                </li>
            </ul>
        </kano-tooltip>
`,

  is: 'kano-workspace-toolbar',
  behaviors: [AppElementRegistryBehavior, I18nBehavior],

  properties: {
      mouseX: {
          type: Number
      },
      mouseY: {
          type: Number
      },
      showMousePosition: {
          type: Boolean,
          value: false
      },
      running: {
          type: Boolean,
          value: false
      },
      editableLayout: {
          type: Boolean,
          value: false
      },
      partsMenuOpen: {
          type: Boolean,
          value: false
      },
      noPlayerBar: {
          type: Boolean,
          value: false
      },
      noPartControls: {
          type: Boolean,
          value: false
      },
      showSettings: {
          type: Boolean,
          value: false
      },
      playPauseLabel: {
          typs: String,
          value: 'Pause'
      },
      fullscreen: {
          type: Boolean,
          value: false
      }
  },

  ready () {
      this.makeButtonIconPaths = {
          stopped: 'M 4,18 10.5,14 10.5,6 4,2 z M 10.5,14 17,10 17,10 10.5,6 z',
          running: 'M 2,18 6,18 6,2 2,2 z M 11,18 15,18 15,2 11,2 z'
      };
  },

  attached () {
      this._registerElement('fullscreen-button', this.$['fullscreen-button']);
      if (!this.noPartControls) {
          this._registerElement('add-part-button', this.$['add-part-button']);
      }
  },

  mousePositionHidden (show) {
      return !show;
  },

  fullscreenClicked (e) {
      this.$['fullscreen-tooltip'].close()
      this.fire('fullscreen-button-clicked');
  },

  _runButtonClicked (e) {
      this.$['play-tooltip'].close();
      this.fire('run-button-clicked');
      this.playPauseLabel = this.running ? 'Pause' : 'Play';
  },

  restartClicked (e) {
      this.fire('restart-button-clicked');
  },

  _getRunningStatus (running) {
      return running ? 'running' : 'stopped';
  },

  _computeEditingButtonLabel (editableLayout) {
      return editableLayout ? this.localize('DONE', 'done') : this.localize('EDIT_LAYOUT', 'Edit Layout');
  },

  _editLayoutClicked () {
      this.fire('edit-layout-button-clicked');
  },

  _togglePartsMenu () {
      this.fire('toggle-parts-menu');
  },

  _computePartsMenuButtonLabel (open) {
      return open ? this.localize('CLOSE', 'close') : this.localize('ADD_PARTS', 'add parts');
  },

  _applyButtonClass (open) {
      return open ? 'open' : '';
  },

  _startTimer (e) {
      const target = e.composedPath()[0];
      this.hoverTimer = this.async(() => {
          this._openTooltip(target);
          this.hoverTimer = null;
      }, 800);
  },

  _stopTimer (e) {
      const target = e.composedPath()[0];
      if (this.hoverTimer) {
          this.cancelAsync(this.hoverTimer);
      }
      this._closeTooltip(target);
  },

  _openTooltip (target) {
      const tooltip = this.$[`${target.id}-tooltip`];
      tooltip.target = target.getBoundingClientRect();
      tooltip.open();
  },

  _closeTooltip (target) {
      const tooltip = this.$[`${target.id}-tooltip`];
      tooltip.close();
  },

  _openSettings (e) {
      const target = e.composedPath()[0];
      const tooltip = this.$['settings-tooltip'];
      tooltip.target = target.getBoundingClientRect();
      tooltip.open();
  },

  _reset () {
      this.$['settings-tooltip'].close();
      this.fire('iron-signal', { name: 'reset-workspace' });
  },

  _export () {
      this.$['settings-tooltip'].close();
      this.fire('iron-signal', { name: 'export-app' });
  },

  _import () {
      this.$['settings-tooltip'].close();
      this.fire('iron-signal', { name: 'import-app' });
  },

  _save () {
      this.$['settings-tooltip'].close();
      this.fire('save-button-clicked');
  },

  _getMinMaxIcon(fullscreen) {
      return fullscreen ? 'minimize' : 'maximize';
  }
});