import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-image/iron-image.js';
import '@kano/kwc-style/color.js';
import { Input } from '../behaviors.js';
import '../../kano-code-shared-styles/kano-code-shared-styles.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style include="kano-code-shared-styles">
            :host {
                @apply --layout-vertical;
            }
            label {
                @apply --kano-part-editor-label;
            }
            paper-dropdown-menu {
                @apply --layout-vertical;
                border-radius: 3px;

                --paper-dropdown-menu-ripple: {
                    display: none;
                };
                --paper-dropdown-menu-icon: {
                    fill: var(--element-theme);
                };

                --paper-menu-button-content: {
                    background-color: transparent;
                    border-radius: 3px;
                };

                --paper-dropdown-menu-button: {
                    color: #fff;
                };
                --paper-input-container-input: {
                    color: #fff;
                    font-size: 14px;
                    font-family: var(--font-body);
                    font-weight: bold;
                };
                --paper-input-container: {
                    border-radius: 3px;
                    white-space: nowrap;
                    font-size: 14px;
                    overflow: hidden;
                    background-color: #484d53;
                    padding: 9px 8px 7px;
                };
                --paper-input-container-underline: {
                    border: none;
                };
                --paper-input-container-underline-focus: {
                    border: none;
                };
            }
            .dropdown-content {
                background-color: var(--color-black);
                color: #fff;
                padding: 0;
                --paper-menu-button-content: {
                    padding: 3px;
                    background-color: var(--color-black);
                };
                --paper-dropdown-menu-button: {
                     left: 0;
                     width: 100%;
                };
                --paper-listbox: {
                    box-sizing: border-box;
                    color: #fff;
                    padding: 0;
                };
                --paper-listbox-color: #fff;
            }
            .dropdown-content paper-item {
                --paper-item: {
                    min-height: 0;
                    font-family: var(--font-body);
                    font-size: 14px;
                    font-weight: bold;
                    box-sizing: border-box;
                    padding: 9px 8px 7px;
                    border-top: 1px solid var(--kano-app-part-editor-border);
                };
                --paper-item-focused: {
                    background-color: var(--element-theme);
                };
            }
            .dropdown-content paper-item:first-child {
                --paper-item: {
                    min-height: 36px;
                    font-family: var(--font-body);
                    font-weight: bold;
                    font-size: 14px;
                    box-sizing: border-box;
                    padding: 9px 8px 7px;
                };
            }
            .dropdown-content paper-item iron-image {
                height: 26px;
                width: 40px;
                margin-right: 16px;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <label hidden\$="[[!label]]">[[label]]</label>
        <paper-dropdown-menu id="dropdown-menu" horizontal-align="left" no-label-float="" no-animations="" on-tap="_computeDropdownStyle">
            <paper-listbox id="dropdown" slot="dropdown-content" class="dropdown-content" selected="{{value}}" attr-for-selected="value">
                <template is="dom-repeat" items="[[options]]" as="option">
                    <paper-item value="[[option.value]]">
                        <iron-image hidden\$="[[!option.image]]" src="[[option.image]]" sizing="contain"></iron-image>
                        <span>[[option.label]]</span>
                    </paper-item>
                </template>
            </paper-listbox>
        </paper-dropdown-menu>
`,

  is: 'kano-input-list',
  behaviors: [Input],

  observers: [
      'valueChanged(value)',
      'themeChanged(theme)'
  ],

  valueChanged () {
      this.fire('change');
  },

  themeChanged (theme) {
      this.updateStyles({
          '--element-theme': theme
      });
  },

  _computeDropdownStyle () {
      let containerWidth = this.$['dropdown-menu'].offsetWidth;
      this.$.dropdown.style.width = `${containerWidth}px`;
  }
});
