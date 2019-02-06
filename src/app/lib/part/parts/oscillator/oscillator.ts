import { Part } from '../../part.js';
import { PartComponent } from '../../component.js';
import { component, property, part } from '../../decorators.js';
import { Wave } from './wave.js';
import { trace } from '../../../decorators.js';

const WAVES = {
    sine(x : number) {
        const angle = ((x * 3.6) * Math.PI) / 180;
        // Normalize to a range of 0 - 100
        return ((Math.sin(angle) * 100) / 2) + 50;
    },
    square(x : number) {
        x %= 100;
        return x > 50 ? 100 : 0;
    },
    sawtooth(x : number) {
        return x % 100;
    },
    triangle(x : number) {
        x %= 100;
        return x > 50 ? 100 - x : x;
    },
};

type WaveType = 'sine'|'square'|'sawtooth'|'triangle';

class OscillatorComponent extends PartComponent {
    @property({ type: Number, value: 0 })
    public x : number = 0;
    
    @property({ type: Number, value: 0 })
    public delay : number = 0;

    @property({ type: Number, value: 50 })
    public speed : number = 50;

    @property({ type: Wave, value: 50 })
    public wave : WaveType = 'sine';
}

@part('oscillator')
export class OscillatorPart extends Part {
    @component(OscillatorComponent)
    public core : OscillatorComponent;
    private timeout : number|null = null;
    constructor() {
        super();
        this.core = this._components.get('core') as OscillatorComponent;
    }
    onStart() {
        if (!this.timeout) {
            this._updateValue();
        }
    }
    onStop() {
        this._stopOscillating();
    }
    getX() {
        return this.core.delay + this.core.x;
    }
    _updateValue() {
        if (this.timeout) {
            this._stopOscillating();
        }
        this.timeout = window.setTimeout(() => {
            this.core.x += this._getStep();
            this._checkBounds();
            this.core.invalidate();
            this._updateValue();
        }, 16);
    }
    _stopOscillating() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = null;
    }
    _getStep() {
        return this.core.speed / 20;
    }
    getSpeed() {
        return this.core.speed;
    }
    setSpeed(s : number) {
        s = Math.min(100, Math.max(0, s));
        this.core.speed = s;
        this.core.invalidate();
    }
    getDelay() {
        return this.core.delay;
    }
    setDelay(d : number) {
        const s = Math.min(100, Math.max(0, d));
        this.core.delay = d;
        this.core.invalidate();
    }
    _checkBounds() {
        if (this.core.x > 100) {
            this.core.x = 101 - this.core.x;
        } else if (this.core.x < 0) {
            this.core.x = 101 + this.core.x;
        }
    }
    getValue() {
        return this.getValueAt(this.core.x);
    }
    getValueAt(x : number) {
        const xWithOffset = this.core.delay + x;
        const fn = WAVES[this.core.wave];
        if (typeof fn === 'function') {
            return fn(xWithOffset);
        }
        return WAVES.sine(xWithOffset);
    }
}