/*
### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
--kano-input-label`
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { Input } from '../behaviors.js';

import '../kano-input-color/kano-input-color.js';
import '../kano-input-range/kano-input-range.js';
import '../kano-input-text/kano-input-text.js';
import '../kano-input-list/kano-input-list.js';
import '../kano-input-toggle/kano-input-toggle.js';
import '../kano-input-image/kano-input-image.js';
import '../kano-input-wave/kano-input-wave.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { AppEditorBehavior } from '../../behaviors/kano-app-editor-behavior.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
        </style>
        <div id="input-container"></div>
`,

  is: 'kano-input',

  behaviors: [Input,
              AppEditorBehavior],

  observers: [
      '_typeChanged(type)',
  ],

  _typeChanged() {
      let inputTagName = this._getTagName(),
          root = dom(this.root);
      const tpl = document.createElement('template');
      tpl.innerHTML = `<${inputTagName} class="kano-input" label="[[label]]" value="{{value}}" symbol="[[symbol]]" min="[[min]]" max="[[max]]" options="[[options]]" theme="[[theme]]"></${inputTagName}>`;

      const template = html`${tpl}`;

      this.instance = this._stampTemplate(template);

      this.$['input-container'].appendChild(this.instance);
  },

  _getTagName() {
      return `kano-input-${this.type}`;
  }
});
