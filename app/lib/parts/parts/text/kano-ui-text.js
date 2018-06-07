import '@kano/kwc-style/typography.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { WebCollidableMixin } from '../../../../scripts/kano/make-apps/parts-api/web-collidable.js';

class KanoPartText extends WebCollidableMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-ui-text'; }
    static get template() {
        return html`
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
        `;
    }
    computeLabelStyle() {
        return this.getPartialStyle(['font-size', 'color', 'font-family']);
    }
    setValue(value) {
        this.set('model.userProperties.text', value);
        this._updateCollisionSize();
    }
    getValue() {
        return this.get('model.userProperties.text');
    }
    textClicked() {
        this.dispatchEvent(new CustomEvent('clicked', { bubbles: true }));
    }
    renderOnCanvas(ctx, ...args) {
        return super.renderOnCanvas(ctx, ...args).then(() => {
            const { text } = this.model.userProperties;
            const { color } = this.model.userStyle;

            ctx.textAlign = 'start';
            ctx.textBaseline = 'top';
            ctx.font = `${this.model.userStyle['font-size']} ${this.model.userStyle['font-family']}`;
            ctx.fillStyle = color;
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }
}

customElements.define(KanoPartText.is, KanoPartText);
