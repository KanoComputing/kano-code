import { AudioPlayer } from '../../../../scripts/kano/music/player.js';

function isPi() {
    const { userAgent } = window.navigator;

    return userAgent.indexOf('armv6l') !== -1 ||
           userAgent.indexOf('armv7l') !== -1;
}
/*
 *
 * Speech synthesis service
 *
 *   Detects the capabilities of the client and choses the most suitable
 *   backend for text to speech synthesis.
 *
 */
class TextToSpeech {
    constructor(config) {
        this.config = config;

        this.backend = this.remote;
        this.backendStop = this.remoteStop;
        this.ctx = AudioPlayer.context;

        this.cache = {};
        this.playQueue = [];
    }

    configure(c) {
        this.config = c;

        if (window.speechSynthesis && !isPi()) {
            this.backend = this.browser;
            this.backendStop = this.browserStop;
        }

        return this;
    }

    speak(text, rate = 1, language = 'en-GB') {
        this.backend(text, rate, language);
    }

    stop() {
        this.backendStop();
    }

    browser(text, rate, language) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.pitch = 1;
        msg.rate = rate;
        msg.lang = language;

        window.speechSynthesis.speak(msg);
    }

    browserStop() {
        window.speechSynthesis.cancel();
    }

    remote(text, rate, language) {
        let params = {
                key: this.config.VOICE_API_KEY,
                src: text,
                hl: language.toLowerCase(),
                r: this.normaliseRateToRSS(rate),
                c: 'OGG',
            },
            url,
            cacheTag = `${language}-${rate}`,
            urlParams = [];

        this.cache[cacheTag] = this.cache[cacheTag] || {};

        if (text in this.cache[cacheTag]) {
            this.playAudio(this.cache[cacheTag][text]);
            return;
        }

        for (const p of Object.keys(params)) {
            urlParams.push(`${p}=${encodeURIComponent(params[p])}`);
        }

        url = `${this.config.VOICE_API_URL}/?${urlParams.join('&')}`;

        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.arrayBuffer();
                } 
                    console.log("Voice API request failed: " + res.status);
                    
                
            }).then((ab) => {
                this.ctx.decodeAudioData(ab, (buffer) => {
                    this.playAudio(buffer);
                    if (!(text in this.cache[cacheTag])) {
                        this.cache[cacheTag][text] = buffer;
                    }
                });
            }).catch((err) => {
                console.log(`Voice API request failed: ${  err}`);
            });
    }

    remoteStop() {
        this.audioStop();
    }

    playAudio(buffer) {
        this.playQueue.push(buffer);
        if (this.playQueue.length === 1) {
            this.playNext();
        }
    }

    playNext() {
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

    audioStop() {
        if (this.playQueue.length > 0 && typeof this.playQueue[0].stop === 'function') {
            this.playQueue[0].stop();
        }
        this.playQueue = [];
    }

    normaliseRateToRSS(rate) {
        if (rate < 0) {
            console.log('Invalid speech rate, falling back to 0.');
        } else if (rate >= 0 && rate < 1) {
            return (1 - rate) * (-10);
        } else if (rate >= 1 && rate <= 10) {
            return rate;
        }

        console.log('Invalid speech rate, falling back to 10.');
        return 10;
    }
}

export { TextToSpeech };
