import { Part, IPartContext } from '../../part.js';
import { Monotron } from '../../../../scripts/kano/music/monotron/monotron.js';
import { part, property, component } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { debug } from '../../../decorators.js';

const OSCILLATOR_FREQ_RANGE_LOW = 55; // --> A0 note in pitch standard tuning
const DEFAULT_FREQ = 220; // --> A2

class SynthComponent extends PartComponent {
    @property({ type: Number, value: 100 })
    volume : number = 100;
    @property({ type: Boolean, value: false })
    muted : boolean = false;
}

@part('synth')
export class SynthPart extends Part {
    @component(SynthComponent)
    public core : SynthComponent;
    private volumeAttenuation : number = 0.00075;
    private waveType : OscillatorType = 'sine';
    private gainNode? : GainNode;
    private ctx? : AudioContext;
    private dest? : AudioNode;
    private sources : Monotron[] = [];
    private monotron : Monotron|null = null;
    constructor() {
        super();
        this.core = this._components.get('core') as SynthComponent;
    }
    onInstall(context : IPartContext) {
        this.ctx = context.audio.context;
        this.dest = context.audio.destination;

        this.gainNode = this.ctx.createGain();
        this.gainNode.connect(this.dest);

        this.setVolume(this.core.volume);
    }
    onStop() {
        this.sources.forEach((source) => {
            // Ignore sources not started
            try {
                source.stop();
            } catch (e) {}
        });
        this.sources.length = 0;
        this.stop();
    }
    setVolume(volume : number) {
        this.core.volume = Math.min(Math.max(volume, 0), 100);
        // the maximum value is limited to an ear-friendly volume
        this.volumeAttenuation = /sine|triangle/.test(this.waveType) ? 0.00185 : 0.00075;
        const value = this.core.muted ? 0 : (this.core.volume * this.volumeAttenuation);
        if (this.gainNode) {
            this.gainNode.gain.value = value;
        }
        this.core.invalidate();
    }
    _createMonotron() {
        if (!this.ctx) {
            throw new Error('Could not create monotron: AudioContext is not defined');
        }
        const opts = {
            ctx: this.ctx,
            waveType: this.waveType,
        };
        this.setVolume(this.core.volume);
        const monotron = new Monotron(opts);
        if (this.gainNode) {
            monotron.connect(this.gainNode);
        }
        return monotron;
    }
    clamp(value : number, min : number, max : number) {
        return Math.min(Math.max(value, min), max);
    }
    playFrequency(freq : number, length : number) {
        if (!this.ctx) {
            return;
        }
        freq = this.clamp(freq, 0, 100);
        length = this.clamp(length, 0, 1000 * 60 * 5);

        const monotron = this._createMonotron();

        // each cent increments the frequency with a quarter note
        freq = OSCILLATOR_FREQ_RANGE_LOW * Math.pow(2, freq / 24);
        monotron.noteOn(freq);
        monotron.noteOff(this.ctx.currentTime + length / 1000);

        monotron.vco.onended = () => {
            const index = this.sources.indexOf(monotron);
            if (index >= 0) {
                setTimeout(() => {
                    this.sources.splice(index, 1);
                }, 0);
            }
        };
        this.sources.push(monotron);
    }
    start() {
        if (!this.monotron) {
            this.monotron = this._createMonotron();
            this.monotron.noteOn(DEFAULT_FREQ);
            this.sources.push(this.monotron);
        }
    }
    stop() {
        if (this.monotron) {
            this.monotron.stop();
        }
        this.monotron = null;
    }
    setPitch(freq : number) {
        freq = this.clamp(freq, 0, 100);

        if (this.monotron) {
            // each cent increments the frequency with a quarter note
            freq = OSCILLATOR_FREQ_RANGE_LOW * Math.pow(2, freq / 24);
            this.monotron.noteOn(freq);
        }
    }
    setWave(wave : OscillatorType) {
        this.waveType = wave;
        if (!this.monotron) {
            return;
        }
        this.monotron.setWaveType(wave);

        // Set volume as the attenuation depends on the wave type
        this.setVolume(this.core.volume);
    }
}
