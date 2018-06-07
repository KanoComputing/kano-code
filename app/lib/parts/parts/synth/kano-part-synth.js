import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BaseMixin } from '../../base.js';
import { Monotron } from '../../../../scripts/kano/music/monotron/monotron.js';
import { AudioPlayer } from '../../../../scripts/kano/music/player.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';

const OSCILLATOR_FREQ_RANGE_LOW = 55; // --> A0 note in pitch standard tuning
const DEFAULT_FREQ = 220; // --> A2

class KanoPartSynth extends BaseMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-part-synth'; }
    static get properties() {
        return {
            volume: {
                type: Number,
                value: 100,
            },
            waveType: {
                type: String,
                value: 'sine',
            },
            volumeAttenuation: {
                type: Number,
                value: 0.00075,
            },
        };
    }
    static get observers() {
        return [
            '_mutedChanged(model.muted)',
        ];
    }
    constructor() {
        super();
        this.sources = [];
        try {
            this.ctx = AudioPlayer.context;
            this.webAudioSupported = true;
            this.gainControl = this.ctx.createGain();
            this.gainControl.connect(this.ctx.destination);
            this.output = this.gainControl;
            this.setVolume(this.volume);
        } catch (e) {
            this.webAudioSupported = false;
        }
    }
    start(...args) {
        super.start(...args);
        this.volume = 100;
    }
    stop(...args) {
        super.stop(...args);
        this.sources.forEach((source) => {
            // Ignore sources not started
            try {
                source.stop();
            } catch (e) {}
        });
        this.sources = [];
        this.synth = null;
    }
    _mutedChanged() {
        this.setVolume(this.volume);
    }
    setVolume(volume) {
        if (!this.model || !this.gainControl) {
            return;
        }
        this.volume = Math.min(Math.max(volume, 0), 100);
        // the maximum value is limited to an ear-friendly volume
        this.volumeAttenuation = /sine|triangle/.test(this.waveType) ? 0.00185 : 0.00075;
        const value = this.model.muted ? 0 : (this.volume * this.volumeAttenuation);
        if (this.gainControl) {
            this.gainControl.gain.value = value;
        }
    }
    _createMonotron() {
        const opts = {
            ctx: this.ctx,
            waveType: this.waveType,
        };
        this.setVolume(this.volume);
        const monotron = new Monotron(opts);
        monotron.connect(this.output);

        return monotron;
    }
    _limitNumericValue(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    playFrequency(freq, length) {
        freq = this._limitNumericValue(freq, 0, 100);
        length = this._limitNumericValue(length, 0, 1000 * 60 * 5);

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
    startSynth() {
        if (!this.synth) {
            this.synth = this._createMonotron();
            this.synth.noteOn(DEFAULT_FREQ);
            this.sources.push(this.synth);
        }
    }
    setSynthFrequency(freq) {
        freq = this._limitNumericValue(freq, 0, 100);

        if (this.synth) {
            // each cent increments the frequency with a quarter note
            freq = OSCILLATOR_FREQ_RANGE_LOW * Math.pow(2, freq / 24);
            this.synth.noteOn(freq);
        }
    }
    setSynthWave(wave) {
        this.waveType = wave;
        if (!this.synth) {
            return;
        }
        this.synth.setWaveType(wave);

        // Set volume as the attenuation depends on the wave type
        this.setVolume(this.volume);
    }
}

customElements.define(KanoPartSynth.is, KanoPartSynth);
