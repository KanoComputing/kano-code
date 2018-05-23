import { Base } from './base.js';

const Oscillator = {
    onDestroyed () {
        this._stopOscillating();
    },
    start () {
        Base.start.apply(this);
        this.set('model.x', 0);
        if (!this.timeout) {
            this._updateValue();
        }
    },
    getX () {
        return parseInt(this.get('model.userProperties.delay')) + this.x;
    },
    _updateValue () {
        if (this.timeout) {
            this._stopOscillating();
        }
        this.timeout = setTimeout(() => {
            this.set('model.x', this.model.x + this._getStep());
            this._checkBounds();
            this._updateValue();
        }, 16);
    },
    _stopOscillating () {
        clearTimeout(this.timeout);
        this.timeout = null;
    },
    stop () {
        Base.stop.apply(this);
        this.x = 0;
    },
    _getStep () {
        return this.get('model.userProperties.speed') / 20;
    },
    getSpeed () {
        return this.get('model.userProperties.speed');
    },
    setSpeed (s) {
        s = Math.min(100, Math.max(0, s));
        this.set('model.userProperties.speed', s);
    },
    getDelay () {
        return this.get('model.userProperties.delay');
    },
    setDelay (d) {
        s = Math.min(100, Math.max(0, d));
        this.set('model.userProperties.delay', d);
    },
    _checkBounds () {
        if (this.model.x > 100) {
            this.set('model.x', 101 - this.model.x);
        } else if (this.x < 0) {
            this.set('model.x', 101 + this.model.x);
        }
    },
    getValue () {
        return this.getValueAt(this.model.x);
    },
    getValueAt (x) {
        let wave = this.get('model.userProperties.wave'),
            xWithOffset = parseInt(this.get('model.userProperties.delay')) + x;
        if (this.waves[wave]) {
            return this.waves[wave](xWithOffset);
        }
        return this.waves.sine(xWithOffset);
    },
    waves: {
        sine (x) {
            let angle = ((x * 3.6) * Math.PI) / 180;
            // Normalize to a range of 0 - 100
            return ((Math.sin(angle) * 100) / 2) + 50;
        },
        square (x) {
            x = x % 100;
            return x > 50 ? 100 : 0;
        },
        sawtooth (x) {
            return x % 100;
        },
        triangle (x) {
            x = x % 100;
            return x > 50 ? 100 - x : x;
        }
    }
};

/**
 * @polymerBehavior
 */
export const oscillator = Object.assign({}, Base, Oscillator);
