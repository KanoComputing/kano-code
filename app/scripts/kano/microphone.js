// Cross browser tweaks
// Putting getUserMedia in navigator is a wrong practice since the spec moved it inside MediaDevices
// but calling it outside of navigator will fail on chrome
window.MediaDevices = window.MediaDevices || {};
if (window.MediaDevices && window.MediaDevices.getUserMedia) {
    navigator.getUserMedia = window.MediaDevices.getUserMedia;
}
navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const VOLUME_REFRESH_RATE = 32;
const PITCH_REFRESH_RATE = 100;

/**
 * Provides volume and pitch data from the user's microphone using getUserMedia.
 * Intended to be used as a singleton
 */
class MicrophoneImpl {
    constructor() {
        this._onStreamReady = this._onStreamReady.bind(this);
        this._onStreamError = this._onStreamError.bind(this);
        // Internal Promise with resolution and rejection
        // bound to the instance's _onReady and _onError methods
        this.ready = new Promise((resolve, reject) => {
            this._onReady = resolve;
            this._onFail = reject;
        });
        this.started = false;
    }

    start() {
        // start can be called multiple times, but we only get the user media once
        if (this.started) {
            return this.ready;
        }
        try {
            navigator.getUserMedia({ audio: true }, this._onStreamReady, this._onStreamError);
        } catch (e) {
            this._onFail(e);
        }

        this.started = true;
        return this.ready;
    }

    stop() {
        if (this.stream) {
            this.stream.getAudioTracks().forEach((track) => {
                track.stop();
            });
        }
        this.started = false;
        this.stream = null;
    }

    _onStreamReady(stream) {
        this.stream = stream;
        this.audioContext = new window.AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaStreamSource(stream);
        this.analyser.smoothingTimeConstant = 0.5;
        this.analyser.fftSize = 1024;
        this.soundData = new Uint8Array(this.analyser.frequencyBinCount);
        this.pitchData = new Float32Array(this.analyser.frequencyBinCount);

        this.source.connect(this.analyser);
        this._onReady();
    }

    _updateVolumeData() {
        if (!this.analyser) {
            return;
        }
        // Populates the sound data array
        this.analyser.getByteFrequencyData(this.soundData);
        const stats = this._getSoundStats(this.soundData);
        this.volume = Math.min(120, stats.volume) / 1.2;
        this.low = Math.min(120, stats.low) / 1.2;
    }

    _updatePitchData() {
        if (!this.analyser) {
            return;
        }
        this.analyser.getFloatTimeDomainData(this.pitchData);
        const frequency = this._correlatePitch(this.pitchData, this.audioContext.sampleRate);
        if (frequency !== -1 && frequency < 2000) {
            this.pitch = Math.min(100, Math.max(0, (Math.log(frequency) - 5.4) * (100 / 3)));
        }
    }

    _getSoundStats(array) {
        let values = 0,
            lows = 0,
            length = array.length,
            average;

        // get all the frequency amplitudes
        for (let i = 0; i < length; i++) {
            values += array[i];
            if (i === 21) {
                lows = values;
            }
        }

        average = values / length;
        return { volume: average, low: lows / 21 };
    }

    _correlatePitch(buf, sampleRate) {
        const MIN_SAMPLES = 0, // will be initialized when AudioContext is created.
            GOOD_ENOUGH_CORRELATION = 0.9, // this is the "bar" for how close a correlation needs to be
            SIZE = buf.length,
            MAX_SAMPLES = Math.floor(SIZE / 2),
            correlations = new Array(MAX_SAMPLES);
        let best_offset = -1,
            best_correlation = 0,
            rms = 0,
            foundGoodCorrelation = false;

        for (let i = 0; i < SIZE; i++) {
            const val = buf[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01) { // not enough signal
            return -1;
        }

        let lastCorrelation = 1;
        for (let offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
            let correlation = 0;

            for (let i = 0; i < MAX_SAMPLES; i++) {
                correlation += Math.abs((buf[i]) - (buf[i + offset]));
            }
            correlation = 1 - (correlation / MAX_SAMPLES);
            correlations[offset] = correlation; // store it, for the tweaking we need to do below.
            if ((correlation > GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
                foundGoodCorrelation = true;
                if (correlation > best_correlation) {
                    best_correlation = correlation;
                    best_offset = offset;
                }
            } else if (foundGoodCorrelation) {
                // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
                // Now we need to tweak the offset - by interpolating between the values to the left and right of the
                // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
                // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
                // (anti-aliased) offset.

                // we know best_offset >=1,
                // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
                // we can't drop into this clause until the following pass (else if).
                const shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
                return sampleRate / (best_offset + (8 * shift));
            }
            lastCorrelation = correlation;
        }
        if (best_correlation > 0.01) {
            return sampleRate / best_offset;
        }
        return -1;
    }

    _updateVolumeDataIfNeeded() {
        const now = new Date();
        if (!this._lastVolumeUpdate || now - this._lastVolumeUpdate > VOLUME_REFRESH_RATE) {
            this._updateVolumeData();
            this._lastVolumeUpdate = now;
        }
    }

    _updatePitchDataIfNeeded() {
        const now = new Date();
        if (!this._lastPitchUpdate || now - this._lastPitchUpdate > PITCH_REFRESH_RATE) {
            this._updatePitchData();
            this._lastPitchUpdate = now;
        }
    }

    /**
     * Return the volume data from the microphone ( between 0 and 100 ) Updates if the data is stale
     */
    getVolume() {
        this._updateVolumeDataIfNeeded();
        return this.volume || 0;
    }

    /**
     * Return the pitch data from the microphone ( between 0 and 100 ) Updates if the data is stale
     */
    getPitch() {
        this._updatePitchDataIfNeeded();
        return this.pitch;
    }

    _onStreamError(e) {
        this._onFail(e);
    }
}

// Is a singleton, all microphone data is shared
export { MicrophoneImpl as MicrophoneClass };

export const Microphone = new MicrophoneImpl();
