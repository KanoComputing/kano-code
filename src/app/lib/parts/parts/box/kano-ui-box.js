import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { WebCollidableMixin } from '../../../../scripts/kano/make-apps/parts-api/web-collidable.js';

class KanoPartBox extends WebCollidableMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-ui-box'; }
    static get template() {
        return html`
            <style is="custom-style" include="part-style"></style>
            <style>
            :host {
                display: inline-block;
            }
            </style>
            <div id="box" style\$="[[computeImageStyle(model.userStyle.*, model.userProperties.*)]]" on-tap="tapped"></div>
        `;
    }
    setBackgroundColor(color) {
        this.set('model.userStyle.background-color', color);
    }
    setStrokeColor(color) {
        this.set('model.userProperties.strokeColor', color);
    }
    setStrokeSize(size) {
        this.set('model.userProperties.strokeSize', size);
    }
    tapped() {
        this.fire('clicked');
    }
    computeImageStyle() {
        if (!this.model) {
            return '';
        }
        let style = this.getPartialStyle(['width', 'height', 'background-color']);
        style += `border: ${this.model.userProperties.strokeSize}px solid ${this.model.userProperties.strokeColor};`;
        return style;
    }
    renderOnCanvas(ctx, ...args) {
        super.renderOnCanvas(ctx, ...args)
        const width = this.$.box.offsetWidth;
        const height = this.$.box.offsetHeight;
        const padding = this.model.userProperties.strokeSize;

        ctx.fillStyle = this.model.userProperties.strokeColor;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = this.model.userStyle['background-color'];
        ctx.fillRect(padding, padding, width - (padding * 2), height - (padding * 2));

        ctx.stroke();
        ctx.restore();
    }
}

customElements.define(KanoPartBox.is, KanoPartBox);
