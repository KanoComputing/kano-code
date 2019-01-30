import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../kc-workspace-frame/kc-workspace-frame.js';
import '../kc-workspace-frame/kc-parts-controls.js';
import '../kano-workspace-lightboard/kano-workspace-lightboard.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-vertical;
                width: 100%;
                height: 100%;
                padding-top: 12px;
            }
            kc-workspace-frame {
                @apply --layout-vertical;
                @apply --layout-flex;
                margin: 0 40px;
            }
            kc-parts-controls {
                flex: 1;
            }
            kano-workspace-lightboard {
                @apply --layout-flex;
            }
            ::slotted(.data),
            ::slotted(.hardware),
            ::slotted(kano-part-oscillator) {
                display: none;
            }
        </style>
        <kc-workspace-frame id="wrapper" width="[[width]]" height="[[height]]" running="{{running}}">
            <kano-workspace-lightboard id="workspace" width="[[width]]" height="[[height]]" slot="workspace">
                <slot name="part" slot="part"></slot>
            </kano-workspace-lightboard>
            <kc-parts-controls slot="controls" parts-menu-open="[[partsMenuOpen]]" parts="{{parts}}"></kc-parts-controls>
        </kc-workspace-frame>
`,

  is: 'kano-editor-lightboard',

  properties: {
      autoStart: Boolean,
      partsMenuOpen: {
          type: Boolean,
          value: false
      },
      editableLayout: {
          type: Boolean,
          value: false
      },
      running: {
          type: Boolean,
          value: false
      },
      parts: {
          type: Array,
          value: () => {
              return [];
          },
          notify: true
      },
      availableParts: {
          type: Array
      }
  },

  _resetAppState () {
      this.fire('reset-app-state');
  },

  _getRunningStatus (running) {
      return running ? 'running' : 'stopped';
  },

  clear () {
      this.$.workspace.clear();
  },

  getBackgroundColor () {
      this.$.workspace.getBackgroundColor();
  },

  getWorkspace () {
      return this.$.workspace;
  },

  getRestrictElement () {
      return this.$.workspace;
  },

  getViewport () {
      return this.$.workspace;
  },

  getViewportScale () {
      return this.$.wrapper.getScale();
  }
});
