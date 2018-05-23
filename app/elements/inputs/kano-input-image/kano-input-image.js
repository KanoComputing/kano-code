import { Input } from '../behaviors.js';
import '../../kano-fs/kano-fs.js';
import '../kano-file-picker-modal/kano-file-picker-modal.js';
import '../../../../../../@kano/web-components/kano-glint-animation/kano-glint-animation.js';
import { Polymer } from '../../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../../@polymer/polymer/lib/utils/html-tag.js';
import { generators } from '../../../scripts/kano/make-apps/files/stickers.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --layout-center-justified;
                @apply --layout-center;
            }
            :host button {
                @apply --kano-button;
                border-radius: 3px;
                background: var(--element-theme, #54595d);
                font-size: 14px;
                font-weight: bold;
                text-shadow: none;
                padding: 8px 24px;
            }
            :host kano-glint-animation:last-child {
                margin-top: 16px;
            }
            :host button.remove-button {
                background-color: var(--color-chateau);
            }
            :host button.remove-button:hover {
                background-color: var(--color-abbey);
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <h4 hidden\$="[[!title]]">[[title]]</h4>
        <div class="actions">
            <kano-glint-animation id="glint-open" on-mouseenter="_startGlint" on-mouseout="_endGlint">
                <button type="button" on-tap="openModal" class="change-button">Change image</button>
            </kano-glint-animation>
            <kano-glint-animation id="glint-remove" on-mouseenter="_startGlint" on-mouseout="_endGlint" hidden\$="[[!src]]">
                <button type="button" on-tap="removeImage" class="remove-button">Remove image</button>
            </kano-glint-animation>
        </div>
        <kano-file-picker-modal files="[[flatFiles]]" id="modal" on-select-file="fileSelected"></kano-file-picker-modal>
`,

  is: 'kano-input-image',
  behaviors: [Input],

  properties: {
      title: {
          type: String,
          value: null
      },
      size: {
          type: String,
          value: '50px'
      },
      src: {
          type: String,
          value: null
      },
      options: {
          type: Object,
          observer: '_optionsChanged'
      },
      flatFiles: {
          type: Array,
          value: () => {
              return [];
          }
      }
  },

  observers: [
      'valueChanged(src, size)',
      'themeChanged(theme)'
  ],

  attached () {
      document.body.appendChild(this.$.modal);
  },

  detached () {
      document.body.removeChild(this.$.modal);
  },

  _optionsChanged (options) {
      let files = options.files,
          group,
          groupFiles,
          allFiles;
      allFiles = Object.keys(Kano.MakeApps.Files[files]).reduce((acc, groupKey) => {
          group = Kano.MakeApps.Files[files][groupKey];
          groupFiles = Object.keys(group).map((key) => {
              return {
                  name: group[key],
                  type: 'image',
                  data: {
                      src: generators[files](groupKey, key)
                  }
              };
          });
          return acc.concat(groupFiles);
      }, []);
      this.set('flatFiles', allFiles);
  },

  openModal () {
      this.$.modal.open();
  },

  fileSelected (e) {
      let file = e.detail;
      this.set('src', file.data.src);
      this.set('title', file.name);
      this.$.modal.close();
  },

  valueChanged () {
      this.set('value', this.src);
  },

  removeImage () {
      this.set('title', null);
      this.set('src', null);
  },

  themeChanged (theme) {
      this.updateStyles({
          '--element-theme': theme
      });
  },

  _startGlint (e) {
      const target = e.currentTarget ? e.currentTarget : e.composedPath()[0];
      target.running = true;
  },

  _endGlint (e) {
      const target = e.currentTarget ? e.currentTarget : e.composedPath()[0];
      target.running = false;
  }
});
