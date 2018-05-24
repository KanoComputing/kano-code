import { UIBehavior } from '../kano-ui-behavior.js';
import { WebCollidable } from '../../../scripts/kano/make-apps/parts-api/web-collidable.js';
import '@kano/kwc-style/input.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Base } from '../../../scripts/kano/make-apps/parts-api/base.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style is="custom-style" include="input-range"></style>
        <style>
        :host {
            display: block;
        }
        </style>
        <input type="range" min="{{model.userProperties.min}}" max="{{model.userProperties.max}}" value="{{value::input}}">
`,

  is: 'kano-part-slider',
  behaviors: [WebCollidable, UIBehavior],

  properties: {
      value: {
          type: Number,
          value: 0,
          observer: '_valueChanged'
      }
  },

  start () {
      this.setValue(this.model.userProperties.default);
  },

  stop () {
      Base.stop.apply(this, arguments);
      this.target = null;
  },

  getValue () {
      let rawValue = this.get('value');
      return parseInt(rawValue);
  },

  setValue (value) {
      let props = this.model.userProperties;

      this.set('value', Math.min(Math.max(value, props.min), props.max));
  },

  _valueChanged () {
      let value = parseInt(this.value);
      if (this.target) {
          this.target.node.set(this.target.property, value);
      }
      this.fire('update', value);
  }
});
