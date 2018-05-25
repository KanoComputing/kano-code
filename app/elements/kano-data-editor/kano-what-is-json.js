import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer */
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            :host #modal {
                background-color: var(--color-dark);
                color: #fff;
                font-family: var(--font-body);
                border-radius: 6px;
                padding: 16px;
            }
            :host .modal-content {
                font-size: 1.2em;
            }
            :host paper-dialog h2#title {
                text-align: center;
                font-weight: bold;
            }
            :host paper-dialog .buttons {
                @apply --layout-center-justified;
            }
            :host .info-button:hover {
                cursor: pointer;
            }
            :host button.close-modal {
                @apply --kano-button;
                background-color: var(--color-grassland);
                font-size: 14px;
                line-height: 14px;
                text-shadow: none;
                font-weight: bold;
                border-radius: 3px;
                padding: 12px 22px 10px;
            }
            :host button.close-modal:hover {
                background-color: var(--color-sushi);
            }
            :host .modal-content .code-sample {
                font-family: monospace;
                color: #aabbc3;
                line-height: 1.7em;
                font-size: 1.2em;
                background-color: var(--kano-app-editor-workspace-background, #f2f2f2);
                overflow-y: auto;
            }
            :host .modal-content {
                @apply(--layout-vertical);
            }
            :host .line {
                padding-left: 20px;
            }
            :host .line .key {
                color: #80cbc4;
            }
            :host .line .value {
                color: orange;
            }
            :host .line .colon {
                color: #ae94dd;
            }
            :host .line .comment {
                color: #49656f;
            }
        </style>
        <paper-dialog id="modal" with-backdrop="">
            <h2 id="title">What is JSON?</h2>
            <div class="modal-content">
                <marked-element>
                    <script type="text/markdown">
                    What you see in this box, is called a **JSON object**. It is one of the many formats that computers use to exchange information.

                    The curly brackets are like an envelope that will contain the data.
                    &lt;/script>
                </marked-element>
                <div class="code-sample">
                    <code>
                        <div class="line">
                            <span class="key">&lt;key&gt;</span>
                            <span class="colon">:</span>
                            <span class="value">&lt;value&gt;</span>
                            <span class="comma">,</span>
                        </div>
                    </code>
                </div>
                <marked-element>
                    <script type="text/markdown">
                    Inside, each line represent one information. The key is a like a name for the computer to use to access the value.
                    &lt;/script>
                </marked-element>
            </div>
            <div class="buttons">
                <button class="close-modal" dialog-dismiss="">Close</button>
            </div>
        </paper-dialog>
`,

  is: 'kano-what-is-json',

  attached () {
      this.modal = this.$.modal;
  },

  openJsonInfo () {
      this.modal.open();
  }
});