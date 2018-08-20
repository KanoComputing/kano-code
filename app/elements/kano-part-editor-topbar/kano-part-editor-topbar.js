import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/button.js';
import '../kano-icons/parts.js';
import '../kc-dialog-topbar/kc-dialog-topbar.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                border-bottom: 1px solid var(--kano-app-part-editor-border);
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <kc-dialog-topbar icon="parts:[[icon]]" label="[[label]]">
            <slot name="action" slot="action"></slot>
            <button id="done" slot="action" type="button" data-animate\$="[[_computeDataAnimate('450', visible)]]" dialog-dismiss="">Done</button>
        </kc-dialog-topbar>
`,

  is: 'kano-part-editor-topbar',

  behaviors: [
      AppElementRegistryBehavior
  ],

  properties: {
      icon: {
          type: String,
          value: null
      },
      label: String,
      theme: String
  },

  observers: [
      '_onThemeChanged(theme)'
  ],

  attached () {
      this._registerElement('part-editor-done-button', this.$.done);
  },

  _onThemeChanged (theme) {
        this.updateStyles({
            '--kc-dialog-topbar-icon-color': theme
        });
  }
});
