import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { OscillatorMixin } from './oscillator.js';

class KanoPartOscillator extends OscillatorMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-part-oscillator'; }
    connectedCallback() {
        super.connectedCallback();
        this.model.x = 0;
        this._startOscillating();
    }
    _startOscillating() {
        if (!this.timeout) {
            this._updateValue();
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._stopOscillating();
    }
    start(...args) {
        super.start(...args);
    }
    renderOnCanvas() {
        return Promise.resolve();
    }
}

customElements.define(KanoPartOscillator.is, KanoPartOscillator);
