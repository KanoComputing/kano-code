const VOLUME_REFRESH_RATE = 32;
const PITCH_REFRESH_RATE = 100;

/**
 * Provides volume and pitch data from the user's microphone using getUserMedia.
 * Intended to be used as a singleton
 */
export class Microphone {
    public ready? : Promise<void>;
    public started : boolean = false;
    private stream : MediaStream|null = null;
    private ctx : AudioContext;
    private analyser? : AnalyserNode;
    private source? : MediaStreamAudioSourceNode;
    private soundData? : Uint8Array;
    private pitchData? : Float32Array;
    private _lastVolumeUpdate? : number;
    private _lastPitchUpdate? : number;
    public _volume : number = 0;
    public _low : number = 0;
    public _pitch : number = 0;
    constructor(ctx : AudioContext) {
        this.ctx = ctx;
    }
    start() {
        // start can be called multiple times, but we only get the user media once
        if (this.started) {
            return this.ready;
        }
        this.ready = navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => this._onStreamReady(stream));

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
    _onStreamReady(stream : MediaStream) {
        this.stream = stream;
        this.analyser = this.ctx.createAnalyser();
        this.source = this.ctx.createMediaStreamSource(stream);
        this.analyser.smoothingTimeConstant = 0.5;
        this.analyser.fftSize = 1024;
        this.soundData = new Uint8Array(this.analyser.frequencyBinCount);
        this.pitchData = new Float32Array(this.analyser.frequencyBinCount);

        this.source.connect(this.analyser);
    }
    _updateVolumeData() {
        if (!this.analyser || !this.soundData) {
            return;
        }
        // Populates the sound data array
        this.analyser.getByteFrequencyData(this.soundData);
        const stats = this._getSoundStats(this.soundData);
        this._volume = Math.min(120, stats.volume) / 1.2;
        this._low = Math.min(120, stats.low) / 1.2;
    }
    _updatePitchData() {
        if (!this.analyser || !this.pitchData) {
            return;
        }
        this.analyser.getFloatTimeDomainData(this.pitchData);
        const frequency = this._correlatePitch(this.pitchData, this.ctx.sampleRate);
        if (frequency !== -1 && frequency < 2000) {
            this._pitch = Math.min(100, Math.max(0, (Math.log(frequency) - 5.4) * (100 / 3)));
        }
    }
    _getSoundStats(array : Uint8Array) {
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
    _correlatePitch(buf : Float32Array, sampleRate : number) {
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
        const now = Date.now()
        if (!this._lastVolumeUpdate || now - this._lastVolumeUpdate > VOLUME_REFRESH_RATE) {
            this._updateVolumeData();
            this._lastVolumeUpdate = now;
        }
    }
    _updatePitchDataIfNeeded() {
        const now = Date.now()
        if (!this._lastPitchUpdate || now - this._lastPitchUpdate > PITCH_REFRESH_RATE) {
            this._updatePitchData();
            this._lastPitchUpdate = now;
        }
    }
    /**
     * Return the volume data from the microphone ( between 0 and 100 ) Updates if the data is stale
     */
    get volume() {
        this._updateVolumeDataIfNeeded();
        return this._volume || 0;
    }
    /**
     * Return the pitch data from the microphone ( between 0 and 100 ) Updates if the data is stale
     */
    get pitch() {
        this._updatePitchDataIfNeeded();
        return this._pitch;
    }
}
