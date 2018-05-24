import { UIBehavior } from '../../part/kano-ui-behavior.js';
import { sticker } from '../../../scripts/kano/make-apps/parts-api/sticker.js';
import { WebCollidable } from '../../../scripts/kano/make-apps/parts-api/web-collidable.js';
import '@kano/kwc-style/background.js';
import '@polymer/iron-image/iron-image.js';
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
        <iron-image id="image" src="[[model.userProperties.src]]" style\$="[[computeImageStyle(model.userProperties.size)]]" sizing="contain" on-tap="tapped" loaded="{{loaded}}"></iron-image>
`,

  is: 'kano-ui-sticker',
  behaviors: [sticker, WebCollidable, UIBehavior],

  computeImageStyle (size) {
      return `width: ${size}px; height: ${size}px;`;
  },

  tapped () {
      this.fire('clicked');
  },

  attached () {
      if (!this.getSource()) {
          this.setSticker(this.randomSticker());
      }
  },

  renderOnCanvas (ctx) {
      return UIBehavior.renderOnCanvas.apply(this, arguments).then(() => {
          let img,
              image = this.$.image,
              width = image.offsetWidth,
              height = image.offsetHeight,
              x = 0,
              y = 0;

          if (this.loaded) {
              img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = this.model.userProperties.src;

              return new Promise((resolve) => {
                  img.onload = () => {
                      let aspectW = img.width / width,
                          aspectH = img.height / height;
                      if (aspectW > aspectH) {
                          y = height / 2;
                          height = img.height / aspectW;
                          y -= height / 2;
                      } else {
                          x = width / 2;
                          width = img.width / aspectH;
                          x -= width / 2;
                      }
                      ctx.drawImage(img, x, y, width, height);
                      ctx.stroke();
                      ctx.restore();
                      resolve();
                  };
                  img.onerror = () => {
                      resolve(UIBehavior.renderFallback.apply(this, arguments));
                  };
              });
          } else {
              return UIBehavior.renderFallback.apply(this, arguments);
          }
      });
  }
});
