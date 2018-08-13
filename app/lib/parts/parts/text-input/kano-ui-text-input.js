import '@kano/kwc-style/typography.js';
import '@kano/kwc-style/input.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { WebCollidableMixin } from '../../../../scripts/kano/make-apps/parts-api/web-collidable.js';

class KanoPartTextInput extends WebCollidableMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-ui-text-input'; }
    static get template() {
        return html`
            <style is="custom-style" include="part-style"></style>
            <style>
            :host {
                display: inline-block;
            }
            :host input[type='text'] {
                @apply(--kano-input);
                padding: 8px 12px;
                width: 200px;
                border: 1px solid var(--color-dark, black);
            }
            :host input[type='text']:disabled {
                color: black;
            }
            @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
                :host input[type='text'] {
                    width: 120px;
                    padding: 2px 4px;
                }
            }
            </style>
            <input id="input" type="text" value="{{model.userProperties.value::keyup}}" on-keyup="onKeyUp" placeholder\$="[[model.userProperties.placeholder]]" disabled\$="[[!isRunning]]">
        `;
    }
    onKeyUp() {
        this.dispatchEvent(new CustomEvent('input-keyup', { detail: this.value, bubbles: true }));
    }
    getValue() {
        return this.get('model.userProperties.value');
    }
    setValue(value) {
        this.set('model.userProperties.value', value);
    }
    setPlaceholder(placeholder) {
        this.set('model.userProperties.placeholder', placeholder);
    }
    getPlaceholder() {
        return this.get('model.userProperties.placeholder');
    }
    renderOnCanvas(ctx, util, ...args) {
        return super.renderOnCanvas(ctx, util, ...args).then(() => {
            let placeholder = this.model.userProperties.placeholder,
                text = this.model.userProperties.value,
                input = this.$.input,
                width = input.offsetWidth,
                height = input.offsetHeight;

            ctx.beginPath();
            ctx.fillStyle = '#292f35';
            util.roundRect(ctx, 0, 0, width, height, 4, false, true);
            ctx.fillStyle = '#FFFFFF';
            util.roundRect(ctx, 0, 0, width, height, 4, true);
            ctx.textAlign = 'start';
            ctx.textBaseline = 'middle';
            ctx.font = `${util.getStyle(input, 'font-size')} ${util.getStyle(input, 'font-family')}`;
            if (text) {
                ctx.fillStyle = 'black';
                ctx.fillText(text, 12, height / 2);
            } else if (placeholder) {
                ctx.fillStyle = '#dddddd';
                ctx.fillText(placeholder, 12, height / 2);
            }
            ctx.stroke();
            ctx.restore();
        });
    }
}

customElements.define(KanoPartTextInput.is, KanoPartTextInput);
