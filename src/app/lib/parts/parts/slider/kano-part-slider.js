import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@kano/kwc-style/input.js';
import { WebCollidableMixin } from '../../../../scripts/kano/make-apps/parts-api/web-collidable.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';

class KanoPartSlider extends WebCollidableMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-part-slider'; }
    static get properties() {
        return {
            value: {
                type: Number,
                value: 0,
                observer: '_valueChanged',
            },
        };
    }
    static get template() {
        return html`
            <style is="custom-style" include="input-range"></style>
            <style>
            :host {
                display: block;
            }
            </style>
            <input type="range" min="[[model.userProperties.min]]" max="[[model.userProperties.max]]" value="{{value::input}}">
        `;
    }
    start(...args) {
        super.start(...args);
        this.setValue(this.model.userProperties.default);
    }
    stop(...args) {
        super.stop(...args);
        this.target = null;
    }
    getValue() {
        const rawValue = this.get('value');
        return parseInt(rawValue, 10);
    }
    setValue(value) {
        const props = this.model.userProperties;

        this.set('value', Math.min(Math.max(value, props.min), props.max));
    }
    _valueChanged() {
        const value = parseInt(this.value, 10);
        if (this.target) {
            this.target.node.set(this.target.property, value);
        }
        this.dispatchEvent(new CustomEvent('update', { detail: value, bubbles: true }));
    }
}

customElements.define(KanoPartSlider.is, KanoPartSlider);
