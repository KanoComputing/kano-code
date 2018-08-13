import '@kano/kwc-style/button.js';
import '@kano/kwc-style/typography.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { WebCollidableMixin } from '../../../../scripts/kano/make-apps/parts-api/web-collidable.js';

class KanoPartButton extends WebCollidableMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-ui-button'; }
    static get template() {
        return html`
            <style>
                :host {
                    display: inline-block;
                }
                :host button {
                    @apply(--kano-button);
                    background: var(--color-green);
                    border: 2px solid transparent;
                }
                :host(.selected) button {
                    border-color: var(--color-orange);
                }
            </style>
            <button id="button" type="button" on-tap="buttonClicked" style\$="[[computeButtonStyle(model.userStyle.*)]]">
                [[model.userProperties.label]]
            </button>
        `;
    }
    buttonClicked() {
        this.dispatchEvent(new CustomEvent('clicked'));
    }
    computeButtonStyle() {
        return this.getPartialStyle(['background-color', 'color']);
    }
    getLabel() {
        return this.get('model.userProperties.label');
    }
    setLabel(label) {
        this.set('model.userProperties.label', label);
        // The label change causes a size change, update the collision box
        this._updateCollisionSize();
    }
    setBackgroundColour(color) {
        this.set('model.userStyle.background-color', color);
    }
    setColour(color) {
        this.set('model.userStyle.color', color);
    }
    renderOnCanvas(ctx, util, ...args) {
        return super.renderOnCanvas(ctx, util, ...args).then(() => {
            const { button } = this.$;
            const text = this.model.userProperties.label;
            const width = button.offsetWidth;
            const height = button.offsetHeight;

            ctx.fillStyle = this.model.userStyle['background-color'];
            ctx.strokeStyle = 'red';
            util.roundRect(ctx, 0, 0, width, height, 5, true, false);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${util.getStyle(button, 'font-size')} ${util.getStyle(button, 'font-family')}`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.fillText(text.toUpperCase(), width / 2, height / 2 + 1.5);
            ctx.fillStyle = 'white';
            ctx.fillText(text.toUpperCase(), width / 2, height / 2);

            ctx.restore();
        });
    }
}

customElements.define(KanoPartButton.is, KanoPartButton);
