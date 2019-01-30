import '../kc-workspace-frame/kc-workspace-frame.js';
import '../kc-workspace-frame/kc-parts-controls.js';
import '../kano-workspace-camera/kano-workspace-camera.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { WorkspaceBehavior } from '../behaviors/kano-workspace-behavior.js';
/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 5px;
                padding-top: 12px;
                @apply --layout-vertical;
            }
            kc-workspace-frame {
                @apply --layout-vertical;
                @apply --layout-flex;
                margin: 0 40px;
            }
            kc-parts-controls {
                flex: 1;
            }
            kano-workspace-camera {
                @apply --layout-flex;
            }
            ::slotted(.data),
            ::slotted(.hardware),
            ::slotted(kano-part-oscillator) {
                display: none;
            }
        </style>
        <kc-workspace-frame id="wrapper" width="[[width]]" height="[[_computeHeight(height)]]" running="{{running}}">
            <kano-workspace-camera id="workspace" width="[[width]]" height="[[height]]" slot="workspace">
                <slot name="part" slot="part"></slot>
            </kano-workspace-camera>
            <kc-parts-controls slot="controls" parts-menu-open="[[partsMenuOpen]]" parts="{{parts}}"></kc-parts-controls>
        </kc-workspace-frame>
`,

  is: 'kano-editor-camera',
  behaviors: [WorkspaceBehavior],

  properties: {
      autoStart: Boolean,
      running: {
          type: Boolean,
          value: false
      }
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
      return this.$.wrapper.getViewportScale();
  },

  _computeHeight (height) {
      return height + 61;
  }
});
