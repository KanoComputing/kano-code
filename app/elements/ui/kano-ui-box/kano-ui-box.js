import { UIBehavior } from '../../part/kano-ui-behavior.js';
import { WebCollidable } from '../../../scripts/kano/make-apps/parts-api/web-collidable.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style is="custom-style" include="part-style"></style>
        <style>
        :host {
            display: inline-block;
        }
        </style>
        <div id="box" style\$="[[computeImageStyle(model.userStyle.*, model.userProperties.*)]]" on-tap="tapped"></div>
`,

  is: 'kano-ui-box',
  behaviors: [WebCollidable, UIBehavior],

  setBackgroundColor (color) {
      this.set('model.userStyle.background-color', color);
  },

  setStrokeColor (color) {
      this.set('model.userProperties.strokeColor', color);
  },

  setStrokeSize (size) {
      this.set('model.userProperties.strokeSize', size);
  },

  tapped () {
      this.fire('clicked');
  },

  computeImageStyle () {
      let style = this.getPartialStyle(['width', 'height', 'background-color']);
      style += `border: ${this.model.userProperties.strokeSize}px solid ${this.model.userProperties.strokeColor};`;
      return style;
  },

  renderOnCanvas (ctx) {
      UIBehavior.renderOnCanvas.apply(this, arguments);
      let width = this.$.box.offsetWidth,
          height = this.$.box.offsetHeight,
          padding = this.model.userProperties.strokeSize;

      ctx.fillStyle = this.model.userProperties.strokeColor;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = this.model.userStyle['background-color'];
      ctx.fillRect(padding, padding, width - padding * 2, height - padding * 2);

      ctx.stroke();
      ctx.restore();
  }
});
