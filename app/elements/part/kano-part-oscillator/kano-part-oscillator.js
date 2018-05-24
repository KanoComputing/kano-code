import { UIBehavior } from '../kano-ui-behavior.js';
import { oscillator } from '../../../scripts/kano/make-apps/parts-api/oscillator.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
/* globals Polymer, Kano */

Polymer({
    is: 'kano-part-oscillator',
    behaviors: [oscillator, UIBehavior],
    attached () {
        this.model.x = 0;
        this._startOscillating();
    },
    _startOscillating () {
        if (!this.timeout) {
            this._updateValue();
        }
    },
    detached () {
        this._stopOscillating();
    },
    start () {
        oscillator.start.apply(this);
    },
    renderOnCanvas () {
        return Promise.resolve();
    }
});
