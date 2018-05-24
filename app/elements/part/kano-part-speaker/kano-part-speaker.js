import { UIBehavior } from '../kano-ui-behavior.js';
import { Base } from '../../../scripts/kano/make-apps/parts-api/base.js';
import { AudioPlayer } from '../../../scripts/kano/music/player.js';
import { samples as samples$0 } from '../../../scripts/kano/make-apps/files/samples.js';
import { Cache } from '../../../scripts/kano/make-apps/files/cache.js';
import { Store } from '../../../scripts/kano/make-apps/store.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/*
 *
 * Speech synthesis service
 *
 *   Detects the capabilities of the client and choses the most suitable
 *   backend for text to speech synthesis.
 *
 */

/* globals SpeechSynthesisUtterance*/

class TextToSpeech {

    constructor (config) {
        this.config = config;

        this.backend = this.remote;
        this.backendStop = this.remoteStop;
        this.ctx = AudioPlayer.context;

        this.cache = {};
        this.playQueue = [];
    }

    configure (c) {
        this.config = c;

        if (window.speechSynthesis && !window.ClientUtil.isPi()) {
            this.backend = this.browser;
            this.backendStop = this.browserStop;
        }

        return this;
    }

    speak (text, rate=1, language='en-GB') {
        this.backend(text, rate, language);
    }

    stop () {
        this.backendStop();
    }

    browser (text, rate, language) {
        let msg = new SpeechSynthesisUtterance(text);
        msg.pitch = 1;
        msg.rate = rate;
        msg.lang = language;

        window.speechSynthesis.speak(msg);
    }

    browserStop () {
        window.speechSynthesis.cancel();
    }

    remote (text, rate, language) {
        let params = {
            key: this.config.VOICE_API_KEY,
            src: text,
            hl: language.toLowerCase(),
            r: this.normaliseRateToRSS(rate),
            c: 'OGG'
        },
        url,
        cacheTag = `${language}-${rate}`,
        urlParams = [];

        this.cache[cacheTag] = this.cache[cacheTag] || {};

        if (text in this.cache[cacheTag]) {
            this.playAudio(this.cache[cacheTag][text]);
            return;
        }

        for (let p of Object.keys(params)) {
            urlParams.push(`${p}=${encodeURIComponent(params[p])}`);
        }

        url = this.config.VOICE_API_URL + "/?" + urlParams.join('&');

        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.arrayBuffer();
                } else {
                    console.log("Voice API request failed: " + res.status);
                    return;
                }
            }).then((ab) => {
                this.ctx.decodeAudioData(ab, buffer => {
                    this.playAudio(buffer);
                    if (!(text in this.cache[cacheTag])) {
                        this.cache[cacheTag][text] = buffer;
                    }
                });
            }).catch((err) => {
                console.log("Voice API request failed: " + err);
            });
    }

    remoteStop () {
        this.audioStop();
    }

    playAudio (buffer) {
        this.playQueue.push(buffer);
        if (this.playQueue.length === 1) {
            this.playNext();
        }
    }

    playNext () {
        if (this.playQueue.length > 0) {
            let buffer = this.playQueue[0],
                source = this.ctx.createBufferSource();

            source.buffer = buffer;

            source.connect(this.ctx.destination);

            source.onended = () => {
                this.playQueue.shift();
                this.playNext();
            };
            source.start();
        }
    }

    audioStop () {
        if (this.playQueue.length > 0 && typeof this.playQueue[0].stop === 'function') {
            this.playQueue[0].stop();
        }
        this.playQueue = [];
    }

    normaliseRateToRSS (rate) {
        if (rate < 0) {
            console.log("Invalid speech rate, falling back to 0.");
        } else if (rate >= 0 && rate < 1) {
            return (1 - rate) * (-10);
        } else if (rate >= 1 && rate <= 10) {
            return rate;
        }

        console.log("Invalid speech rate, falling back to 10.");
        return 10;
    }
}

export { TextToSpeech };

Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
        </style>
        <div class="part">
            <kano-ui-item model="[[model]]" size="50" id\$="part-[[model.id]]" instance=""></kano-ui-item>
        </div>
`,

  is: 'kano-part-speaker',

  behaviors: [
      Base,
      UIBehavior,
  ],

  observers: [
      '_mutedChanged(model.muted)'
  ],

  properties: {
      volume: {
          type: Number,
          value: 100
      }
  },

  ready() {
      const { config } = Store.getState();
      this.sources = [];
      this.players = [];
      this.oscillators = [];
      this.tts = new TextToSpeech();
      this.tts.configure(config);
      try {
          this.ctx = AudioPlayer.context;
          this.webAudioSupported = true;
          this.gainControl = this.ctx.createGain();
          this.gainControl.connect(this.ctx.destination);
          this.output = this.gainControl;

          this.oscillatorsGain = this.ctx.createGain();
          this.oscillatorsGain.connect(this.output);
          this.oscillatorsGain.gain.value = 0.2;
          this.setVolume(this.volume);
      } catch (e) {
          this.webAudioSupported = false;
      }
  },

  say(text, rate, language) {
      this.tts.speak(text, rate, language);
  },

  play(sample) {
      if (!sample) {
          return;
      }
      this.loadSample(sample)
          .then(buffer => {
              const player = new AudioPlayer(buffer, this.gainControl);
              player.play();
              player.source.playbackRate.value = this._playbackRate;
              this.players.push(player);
          });
  },

  loop(sample) {
      if (!sample) {
          return;
      }
      this.loadSample(sample)
          .then(buffer => {
              const player = new AudioPlayer(buffer, this.gainControl, { loop: true });
              player.play();
              player.source.playbackRate.value = this._playbackRate;
              this.players.push(player);
          });
  },

  setPlaybackRate(rate) {
      let realRate;
      rate = Math.min(Math.max(rate, 0), 200);
      realRate = (rate) * 0.01;
      this.players.forEach(player => {
          if (player.source instanceof AudioBufferSourceNode) {
              player.source.playbackRate.value = realRate;
          }
      });
      this.sources.forEach(source => {
          if (source instanceof AudioBufferSourceNode) {
              source.playbackRate.value = realRate;
          }
      });
      this._playbackRate = realRate;
  },

  start() {
      Base.start.apply(this, arguments);
      this._playbackRate = 1;
      this.volume = 100;
  },

  stop() {
      Base.stop.apply(this, arguments);
      if (this.tts) {
          this.tts.stop();
      }
      this.players.forEach(player => {
          // Ignore sources not started
          try {
              player.stop();
          } catch (e) { }
      });
      this.sources.forEach(source => {
          // Ignore sources not started
          try {
              source.stop();
          } catch (e) { }
      });
      this.players = [];
      this.sources = [];
      this.synth = null;
      this._playbackRate = 1;
  },

  _mutedChanged() {
      this.setVolume(this.volume);
  },

  setVolume(volume) {
      if (!this.model || !this.gainControl) {
          return;
      }

      let value;
      this.volume = Math.min(Math.max(volume, 0), 100);
      //the maximum value is limited to an ear-friendly sound pressure level
      value = this.model.muted ? 0 : (this.volume * 0.004);
      if (this.gainControl) {
          this.gainControl.gain.value = value;
      }
  },

  loadSample(name) {
      return Cache.getFile('samples', name);
  },

  randomSound(set) {
      let randomSample, samples, sets;
      if (!set || set === 'any') {
          sets = Object.keys(samples$0),
              set = sets[Math.floor(Math.random() * sets.length)];
      }
      samples = Object.keys(samples$0[set]);
      randomSample = samples[Math.floor(Math.random() * samples.length)];
      return randomSample;
  },

  _createOscillator() {
      let oscillator = this.ctx.createOscillator();

      oscillator.type = 'sine';
      oscillator.connect(this.oscillatorsGain);

      return oscillator;
  },

  playFrequency(freq, length) {
      let oscillator = this._createOscillator();

      oscillator.frequency.value = OSCILLATOR_FREQ_RANGE_LOW +
          ((freq) / 100) * OSCILLATOR_FREQ_RANGE_HI;
      oscillator.start(0);
      oscillator.stop(this.ctx.currentTime + length / 1000);

      oscillator.onended = () => {
          let index = this.sources.indexOf(oscillator);

          if (index >= 0) {
              setTimeout(() => {
                  this.sources.splice(index, 1);
              }, 0);
          }
      };

      this.sources.push(oscillator);
  },

  startSynth() {
      if (!this.synth) {
          this.synth = this._createOscillator();
          this.sources.push(this.synth);
          this.synth.start(0);
      }
  },

  setSynthFrequency(freq) {
      if (this.synth) {
          this.synth.frequency.value = OSCILLATOR_FREQ_RANGE_LOW +
              ((freq) / 100) * OSCILLATOR_FREQ_RANGE_HI;
      }
  }
});

const OSCILLATOR_FREQ_RANGE_LOW = 20,
    OSCILLATOR_FREQ_RANGE_HI = 5000;
