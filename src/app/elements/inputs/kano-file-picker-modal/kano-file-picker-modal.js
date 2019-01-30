import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { AppEditorBehavior } from '../../behaviors/kano-app-editor-behavior.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            :host #modal {
                max-width: 70vw;
                background: #292f35;
                color: #fff;
                padding: 12px 0px;
                @apply --layout-vertical;
            }
            :host #modal paper-dialog-scrollable {
                @apply --layout-flex;
                --paper-dialog-scrollable: {
                    max-height: 50vh;
                    padding: 0px 60px;
                };
            }
            :host #modal .cancel {
                @apply --kano-button;
                background-color: var(--color-red);
                border-radius: 3px;
                background: #54595d;
                font-size: 14px;
                font-weight: bold;
                text-shadow: none;
                padding: 8px 24px;

            }
            :host #modal header {
                padding: 0px 60px;
                @apply --layout-horizontal;
                @apply --layout-justified;
                @apply --layout-center;
            }
            :host #modal header h2 {
                font-size: 16px;
                font-family: Bariol;
                font-weight: bold;
            }
            :host .cancel .times {
                font-size: 25px;
                font-weight: 500;
                transform: translate(0px, -3px);
            }
        </style>
        <paper-dialog id="modal" opened="{{opened}}" with-backdrop="">
            <header>
                <h2>Click an image to select</h2>
                <button type="button" name="button" class="cancel" dialog-dismiss="">Cancel</button>
            </header>
            <paper-dialog-scrollable>
                <kano-fs files="[[files]]" id="fs" on-dom-change="refitModal"></kano-fs>
            </paper-dialog-scrollable>
        </paper-dialog>
`,

  is: 'kano-file-picker-modal',
  behaviors: [AppEditorBehavior],

  properties: {
      files: {
          type: Array
      },
      opened: {
          type: Boolean,
          observer: 'openedChanged'
      }
  },

  open () {
      this.$.modal.open();
  },

  close () {
      this.$.modal.close();
  },

  refitModal () {
      this.$.modal.refit();
  },

  openedChanged (opened) {
      this.notifyChange('file-picker-' + (opened ? 'open' : 'close'));
  }
});
