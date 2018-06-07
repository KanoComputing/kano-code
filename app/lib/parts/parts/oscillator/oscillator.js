import { BaseMixin } from '../../base.js';

const WAVES = {
    sine(x) {
        const angle = ((x * 3.6) * Math.PI) / 180;
        // Normalize to a range of 0 - 100
        return ((Math.sin(angle) * 100) / 2) + 50;
    },
    square(x) {
        x %= 100;
        return x > 50 ? 100 : 0;
    },
    sawtooth(x) {
        return x % 100;
    },
    triangle(x) {
        x %= 100;
        return x > 50 ? 100 - x : x;
    },
};

export const OscillatorMixin = base => class extends BaseMixin(base) {
    onDestroyed() {
        super.onDestroy();
        this._stopOscillating();
    }
    start(...args) {
        super.start(...args);
        this.set('model.x', 0);
        if (!this.timeout) {
            this._updateValue();
        }
    }
    getX() {
        return parseInt(this.get('model.userProperties.delay'), 10) + this.x;
    }
    _updateValue() {
        if (this.timeout) {
            this._stopOscillating();
        }
        this.timeout = setTimeout(() => {
            this.set('model.x', this.model.x + this._getStep());
            this._checkBounds();
            this._updateValue();
        }, 16);
    }
    _stopOscillating() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    stop(...args) {
        super.stop(...args);
        this.x = 0;
    }
    _getStep() {
        return this.get('model.userProperties.speed') / 20;
    }
    getSpeed() {
        return this.get('model.userProperties.speed');
    }
    setSpeed(s) {
        s = Math.min(100, Math.max(0, s));
        this.set('model.userProperties.speed', s);
    }
    getDelay() {
        return this.get('model.userProperties.delay');
    }
    setDelay(d) {
        s = Math.min(100, Math.max(0, d));
        this.set('model.userProperties.delay', d);
    }
    _checkBounds() {
        if (this.model.x > 100) {
            this.set('model.x', 101 - this.model.x);
        } else if (this.x < 0) {
            this.set('model.x', 101 + this.model.x);
        }
    }
    getValue() {
        return this.getValueAt(this.model.x);
    }
    getValueAt(x) {
        const wave = this.get('model.userProperties.wave');
        const xWithOffset = parseInt(this.get('model.userProperties.delay'), 10) + x;
        if (WAVES[wave]) {
            return WAVES[wave](xWithOffset);
        }
        return WAVES.sine(xWithOffset);
    }
};

export default OscillatorMixin;
