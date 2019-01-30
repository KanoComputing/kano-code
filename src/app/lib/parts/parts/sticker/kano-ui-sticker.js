import '@kano/kwc-style/background.js';
import '@polymer/iron-image/iron-image.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { StickerMixin } from './sticker.js';
import { WebCollidableMixin } from '../../../../scripts/kano/make-apps/parts-api/web-collidable.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';

class KanoPartSticker extends WebCollidableMixin(StickerMixin(UIMixin(PolymerElement))) {
    static get is() { return 'kano-ui-sticker'; }
    static get template() {
        return html`
            <style is="custom-style" include="part-style"></style>
            <style>
            :host {
                display: inline-block;
                z-index: 1;
            }
            </style>
            <iron-image id="image" src="[[model.userProperties.src]]" style\$="[[computeImageStyle(model.userProperties.size)]]" sizing="contain" on-tap="tapped" loaded="{{loaded}}"></iron-image>
        `;
    }
    computeImageStyle(size) {
        return `width: ${size}px; height: ${size}px;`;
    }
    tapped() {
        this.dispatchEvent(new CustomEvent('clicked', { composed: true, bubbles: true }));
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.getSource()) {
            this.setSticker(this.randomSticker());
        }
    }
    renderOnCanvas(ctx, ...args) {
        return super.renderOnCanvas(ctx, ...args).then(() => {
            let img,
                image = this.$.image,
                width = image.offsetWidth,
                height = image.offsetHeight,
                x = 0,
                y = 0;

            if (this.loaded) {
                img = new Image();
                img.crossOrigin = 'Anonymous';
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
                        resolve(super.renderFallback(ctx, ...args));
                    };
                });
            }
            return super.renderFallback(ctx, ...args);
        });
    }
}

customElements.define(KanoPartSticker.is, KanoPartSticker);
