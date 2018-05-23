import { UIBehavior } from '../kano-ui-behavior.js';
import { Base } from '../../../scripts/kano/make-apps/parts-api/base.js';
import { Monotron } from '../../../scripts/kano/music/monotron/monotron.js';
import { AudioContext as AudioContext$0 } from '../../../scripts/kano/music/player.js';
import { Polymer } from '../../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="kano-part-synth">
    <style>
        :host {
            display: block;
        }
    </style>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
export const AudioContext = AudioContext$0 || new AudioContext();

const OSCILLATOR_FREQ_RANGE_LOW = 55, // --> A0 note in pitch standard tuning
      DEFAULT_FREQ = 220 // --> A2

Polymer({
    is: 'kano-part-synth',
    behaviors: [Base, UIBehavior],
    observers: [
        '_mutedChanged(model.muted)'
    ],
    properties: {
        volume: {
            type: Number,
            value: 100
        },
        waveType: {
            type: String,
            value: 'sine'
        },
        volumeAttenuation: {
            type: Number,
            value: 0.00075
        }
    },
    ready () {
        this.sources = [];
        try {
            this.ctx = AudioContext$0;
            this.webAudioSupported = true;
            this.gainControl = this.ctx.createGain();
            this.gainControl.connect(this.ctx.destination);
            this.output = this.gainControl;
            this.setVolume(this.volume);
        } catch (e) {
            this.webAudioSupported = false;
        }
    },
    start () {
        Base.start.apply(this, arguments);
        this.volume = 100;
    },
    stop () {
        Base.stop.apply(this, arguments);
        this.sources.forEach(source => {
            // Ignore sources not started
            try {
                source.stop();
            } catch (e) {}
        });
        this.sources = [];
        this.synth = null;
    },
    _mutedChanged () {
        this.setVolume(this.volume);
    },
    setVolume (volume) {
        if (!this.model || !this.gainControl) {
            return;
        }
        let value;
        this.volume = Math.min(Math.max(volume, 0), 100);
        //the maximum value is limited to an ear-friendly volume
        this.volumeAttenuation = /sine|triangle/.test(this.waveType) ? 0.00185 : 0.00075;
        value = this.model.muted ? 0 : (this.volume * this.volumeAttenuation);
        if (this.gainControl) {
            this.gainControl.gain.value = value;
        }
    },
    _createMonotron () {
        let opts = {
            ctx: this.ctx,
            waveType: this.waveType
        };
        this.setVolume(this.volume);
        let monotron = new Monotron(opts);
        monotron.connect(this.output);

        return monotron;
    },
    _limitNumericValue (value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    playFrequency (freq, length) {
        freq = this._limitNumericValue(freq, 0, 100);
        length = this._limitNumericValue(length, 0, 1000 * 60 * 5);

        let monotron = this._createMonotron();

        //each cent increments the frequency with a quarter note
        freq = OSCILLATOR_FREQ_RANGE_LOW * Math.pow(2, freq / 24);
        monotron.noteOn(freq);
        monotron.noteOff(this.ctx.currentTime + length / 1000);

        monotron.vco.onended = () => {
            let index = this.sources.indexOf(monotron);

            if (index >= 0) {
                setTimeout(() => {
                    this.sources.splice(index, 1);
                }, 0);
            }
        };

        this.sources.push(monotron);
    },
    startSynth () {
        if (!this.synth) {
            this.synth = this._createMonotron();
            this.synth.noteOn(DEFAULT_FREQ);
            this.sources.push(this.synth);
        }
    },
    setSynthFrequency (freq) {
        freq = this._limitNumericValue(freq, 0, 100);

        if (this.synth) {
            //each cent increments the frequency with a quarter note
            freq = OSCILLATOR_FREQ_RANGE_LOW * Math.pow(2, freq / 24);
            this.synth.noteOn(freq);
        }
    },
    setSynthWave (wave) {
        this.waveType = wave;
        if (!this.synth) {
            return;
        }
        this.synth.setWaveType(wave);

        // Set volume as the attenuation depends on the wave type
        this.setVolume(this.volume);
    }
});
