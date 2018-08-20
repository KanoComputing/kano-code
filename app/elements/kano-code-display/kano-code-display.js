/**
@group Kano Elements
@hero hero.svg
@demo demo/kano-code-display.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/prism-element/prism-highlighter.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import './kano-prism-theme.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */
const CODE_DISPLAY_LINE_HEIGHT = 20;
Polymer({
  _template: html`
        <style include="kano-prism-theme">
            :host {
                box-sizing: border-box;
                padding: 8px 8px 0 0;
                @apply --layout-horizontal;
            }
            :host pre {
                width: 100%;
                color: #fff;
                white-space: pre-wrap;
                padding: 0;
                margin: 0 0 0 10px;
                font-size: 14px;
                line-height: 20px;
                counter-reset: line;
            }
            :host .line-number-container {
                color: #fff;
                opacity: 0.1;
                margin-right: 8px;
                @apply --layout-vertical;
            }
            :host .line-number {
                height: 20px;
                counter-increment: line;
            }
            :host .line-number:before {
                line-height: 20px;
                font-family: var(--font-body);
                font-size: 14px;
                font-weight: bold;
                content: counter(line);
            }
        </style>
        <prism-highlighter></prism-highlighter>
        <div class="line-number-container">
            <template id="dodge" is="dom-repeat" items="[[lines]]">
                <span class="line-number"></span>
            </template>
        </div>
        <pre id="output"></pre>
`,

  is: 'kano-code-display',
  behaviors: [IronResizableBehavior],

  properties: {
      code: {
          type: String,
          observer: '_render'
      },
      lang: {
          type: String
      },
      lines: {
          type: Array,
          value: () => []
      }
  },

  listeners: {
      'iron-resize': '_computeLineNumbers'
  },

  _render (code) {
      if (!code) {
          return;
      }
      this.$.output.style.height = 0;
      this.$.output.innerHTML = this._highlight(this.code, this.lang);
      this._computeLineNumbers();
  },

  _highlight (code, lang) {
      //prism-highlighter adds an event listener to its parent (i.e. kano-code-display) for 'syntax-highlight'
      return this.fire('syntax-highlight', { code: code, lang: lang }).detail.code;
  },

  _computeLineNumbers () {
      let codeSpaceHeight = this.$.output.scrollHeight,
          lines = Math.round(codeSpaceHeight / CODE_DISPLAY_LINE_HEIGHT);
      this.set('lines', new Array(lines));
  }
});
