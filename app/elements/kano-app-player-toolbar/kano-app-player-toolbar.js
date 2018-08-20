import '../kano-animated-svg/kano-animated-svg.js';
import '@kano/kwc-icons/kwc-icons.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            :host([layout="vertical"]) .panel {
                @apply --layout-vertical;
                @apply --layout-start-justified;
            }
            :host([layout="horizontal"]) .panel {
                @apply --layout-horizontal;
                @apply --layout-center-justified;
            }
            :host .panel {
                @apply --layout-center;
                border-radius: 5px;
                padding: 4px 4px;
                color: white;
            }
            :host .panel .icon iron-icon,
            :host .panel kano-animated-svg {
                color: var(--color-porcelain);
                height: 20px;
                margin: 10px 10px;
                width: 20px;
            }
            .icon kano-animated-svg {
                --kano-animated-path: {
                    fill: var(--color-porcelain);
                    stroke: var(--color-porcelain);
                    stroke-width: 2px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    transition: all ease-in-out 200ms;
                }
            }
            :host .panel .icon {
                @apply --layout-center;
                @apply --layout-justified;
                background-color: var(--color-abbey);
                border-radius: 3px;
                cursor: pointer;
                height: 40px;
                transition: 0.2s background ease-in-out;
                width: 40px;
            }
            :host([layout="horizontal"]) .panel .icon:nth-child(n+2) {
                margin-left: 16px;
            }
            :host([layout="vertical"]) .panel .icon:nth-child(n+2) {
                margin-top: 16px;
            }
            :host .panel .icon:hover {
                background-color: var(--color-kano-orange);
            }
        </style>
        <div class="panel">
            <div class="pause icon" on-tap="pauseClicked">
                <kano-animated-svg width="19" height="21" paths="[[makeButtonIconPaths]]" selected="{{_getRunningStatus(running)}}">
                </kano-animated-svg>
            </div>
            <div class="fullscreen icon" on-tap="fullscreenClicked">
                <iron-icon icon="kano-icons:fullscreen"></iron-icon>
            </div>
            <div class="reset icon" on-tap="resetClicked">
                <iron-icon icon="kano-icons:reset"></iron-icon>
            </div>
        </div>
`,

  is: 'kano-app-player-toolbar',

  properties: {
      layout: {
          type: String,
          value: 'horizontal',
          reflectToAttribute: true
      },
      running: {
          type: Boolean
      }
  },

  ready () {
      this.makeButtonIconPaths = {
          stopped: 'M 4,18 10.5,14 10.5,6 4,2 z M 10.5,14 17,10 17,10 10.5,6 z',
          running: 'M 2,18 6,18 6,2 2,2 z M 11,18 15,18 15,2 11,2 z'
      };
  },

  attached () {
  },

  mousePositionHidden (show) {
      return !show;
  },

  fullscreenClicked (e) {
      this.fire('fullscreen-button-clicked');
  },

  pauseClicked (e) {
      this.fire('run-button-clicked');
  },

  resetClicked (e) {
      this.fire('reset-button-clicked');
  },

  _getRunningStatus (running) {
      return running ? 'running' : 'stopped';
  }
});
