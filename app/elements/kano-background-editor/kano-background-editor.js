import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../kano-code-shared-styles/kano-code-shared-styles.js';
import '../kc-dialog-topbar/kc-dialog-topbar.js';
import '@kano/kwc-color-picker/kwc-color-picker.js';
import { Material } from '@kano/kwc-color-picker/palettes/material.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class KanoBackgroundEditor extends PolymerElement {
  static get template() {
    return html`
        <style include="kano-code-shared-styles">
            :host {
                display: block;
                --kwc-color-picker-margin: 0px;
                --kc-dialog-topbar-icon-color: var(--color-orange);
            }
            kc-dialog-topbar {
                border-bottom: 1px solid var(--kano-app-part-editor-border);
            }
            #picker {
                padding: 32px;
            }
        </style>
        <kc-dialog-topbar label="Background" icon="aspect-ratio">
            <button slot="action" type="button" dialog-dismiss="">Done</button>
        </kc-dialog-topbar>
        <kwc-color-picker id="picker" value="{{value}}"></kwc-color-picker>
`;
  }

  static get is() { return 'kano-background-editor' }
  static get properties() {
      return {
          value: {
              type: String,
              notify: true,
          },
      };
  }
  connectedCallback() {
      super.connectedCallback();
      this.$.picker.colors = Material.colors;
      this.$.picker.rowSize = Material.rowSize;
  }
}

customElements.define(KanoBackgroundEditor.is, KanoBackgroundEditor);
