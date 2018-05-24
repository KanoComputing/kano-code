window.SharedAudioContext = window.SharedAudioContext || new AudioContext();

class AudioPlayer {
    constructor (buffer, output, opts) {
        this.opts = Object.assign({
            loop: false
        }, opts);
        this.buffer = buffer;
        this.ctx = SharedAudioContext;
        this.gainControl = this.ctx.createGain();
        this.gainControl.connect(this.ctx.destination);

        this.output = output || this.gainControl;

        this.volume = 1;
        this.emitter = document.createElement('div');
    }
    emit (name, data) {
        this.emitter.dispatchEvent(new CustomEvent(name, { detail: data }));
    }
    set volume (v) {
        this._volume = Math.max(0, Math.min(1, v));
        this.gainControl.gain.value = this._volume;
    }
    play () {
        this.paused = false;
        this.playing = true;
        this.source = this.ctx.createBufferSource();
        this.source.loop = this.opts.loop;
        this.source.buffer = this.buffer;
        this.source.connect(this.output);
        this.source.onended = event => {
            if (this.paused) {
                return;
            }
            this.emit('end');
            this.stop();
        };
        if (this.pausedAt) {
            this.startedAt = Date.now() - this.pausedAt;
            this.source.start(0, this.pausedAt / 1000);
        } else {
            this.startedAt = Date.now();
            this.source.start(0);
        }
        this.emit('play');
    }
    pause () {
        this.source.stop(0);
        this.pausedAt = Date.now() - this.startedAt;
        this.paused = true;
        this.playing = false;
        this.emit('paused');
    }
    stop () {
        this.pause();
        this.playing = false;
        this.pausedAt = null;
        this.emit('end');
    }
    toggle () {
        this.playing ? this.pause() : this.play();
    }
    static get context () {
        return SharedAudioContext;
    }
}

export { AudioPlayer };
