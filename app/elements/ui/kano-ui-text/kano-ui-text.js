import { UIBehavior } from '../../part/kano-ui-behavior.js';
import { WebCollidable } from '../../../scripts/kano/make-apps/parts-api/web-collidable.js';
import '@kano/kwc-style/typography.js';
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
            span {
                min-width: 30px;
                min-height: 30px;
                outline: 1px dashed lightgrey;
            }
            span[running] {
                outline: 0px;
            }

        </style>
        <span id="label" on-tap="textClicked" style\$="[[computeLabelStyle(model.userStyle.*)]]" running\$="[[isRunning]]">
            {{model.userProperties.text}}
        </span>
`,

  is: 'kano-ui-text',
  behaviors: [WebCollidable, UIBehavior],

  computeLabelStyle () {
      return this.getPartialStyle(['font-size', 'color', 'font-family']);
  },

  setValue (value) {
      this.set('model.userProperties.text', value);
      this._updateCollisionSize();
  },

  getValue () {
      return this.get('model.userProperties.text');
  },

  textClicked () {
      this.fire('clicked');
  },

  renderOnCanvas (ctx) {
      return UIBehavior.renderOnCanvas.apply(this, arguments).then(() => {
          let text = this.model.userProperties.text,
              color = this.model.userStyle.color;

          ctx.textAlign = 'start';
          ctx.textBaseline = 'top';
          ctx.font = `${this.model.userStyle['font-size']} ${this.model.userStyle['font-family']}`;
          ctx.fillStyle = color;
          ctx.fillText(text, 0, 0);
          ctx.restore();
      });
  }
});
