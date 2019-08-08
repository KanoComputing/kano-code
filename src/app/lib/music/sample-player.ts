import { EventEmitter } from '@kano/common/index.js';

export interface ISamplePlayerOptions {
    loop : boolean;
}

export class SamplePlayer {
    private ctx : AudioContext;
    private opts : ISamplePlayerOptions;
    private buffer : AudioBuffer;
    private gainControl : GainNode;
    public output : AudioNode;
    private _volume : number = 0.4;
    private paused : boolean = true;
    private playing : boolean = true;
    public source : AudioBufferSourceNode|null = null;
    private pausedAt : number|null = null;
    private startedAt : number|null = null;
    private _onDidEnd : EventEmitter = new EventEmitter();
    private _onDidStart : EventEmitter = new EventEmitter();
    private _onDidPause : EventEmitter = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }
    get onDidStart() { return this._onDidStart.event; }
    get onDidPause() { return this._onDidPause.event; }
    constructor(ctx : AudioContext, buffer : AudioBuffer, destination : AudioNode, opts : ISamplePlayerOptions) {
        this.ctx = ctx;
        this.opts = Object.assign({
            loop: false,
        }, opts);
        this.buffer = buffer;
        this.gainControl = this.ctx.createGain();
        this.gainControl.connect(destination);

        this.output = this.gainControl;

        this.volume = 0.4;
    }
    set volume(v : number) {
        this._volume = Math.max(0, Math.min(1, v));
        this.gainControl.gain.value = this._volume;
    }
    play(time = 0) {
        this.paused = false;
        this.playing = true;
        this.source = this.ctx.createBufferSource();
        this.source.loop = this.opts.loop;
        this.source.buffer = this.buffer;
        this.source.connect(this.output);
        this.source.onended = () => {
            if (this.paused) {
                return;
            }
            this._onDidEnd.fire();
            this.stop();
        };
        if (this.pausedAt) {
            this.startedAt = Date.now() - this.pausedAt;
            this.source.start(time, this.pausedAt / 1000);
        } else {
            this.startedAt = Date.now();
            this.source.start(time);
        }
        this._onDidStart.fire();
    }
    pause() {
        if (this.source) {
            this.source.stop(0);
        }
        this.pausedAt = Date.now() - this.startedAt!;
        this.paused = true;
        this.playing = false;
        this._onDidPause.fire();
    }
    stop() {
        this.pause();
        this.playing = false;
        this.pausedAt = null;
        this._onDidEnd.fire();
    }
    toggle() {
        if (this.playing) {
            this.pause();
        } else {
            this.play();
        }
    }
}
