export interface IMonotronOptions {
    ctx : AudioContext;
    waveType : OscillatorType;
}

class Monotron {
    private ctx : AudioContext;
    public vco : OscillatorNode;
    private output : GainNode;
    public vcf : BiquadFilterNode;
    private filterOn? : boolean;
    constructor (opts : IMonotronOptions) {
        this.ctx = opts.ctx;
        this.vco = this.ctx.createOscillator();
        this.output = this.ctx.createGain();
        this.output.gain.value = 0;

        this.vcf = this.ctx.createBiquadFilter();
        this.vcf.type = 'bandpass';
        this.vcf.frequency.value = 5000;
        this.vcf.Q.value = 10;

        this.setWaveType(opts.waveType);

        this.vco.connect(this.output);
        this.vco.start(this.ctx.currentTime);
    }

    setWaveType(wave : OscillatorType) {
        // Connect the vcf filter depending on the wave type
        if (this.filterOn && (wave === 'sine' || wave === 'triangle')) {
            this.vco.disconnect(this.vcf);
            this.filterOn = false;
        } else if (!this.filterOn && (wave === 'square' || wave === 'sawtooth')) {
            this.vco.connect(this.vcf);
            this.filterOn = true;
        }

        this.vco.type = wave;
    }

    noteOn(freq : number, time? : number) {
        time = (typeof time === 'undefined') ? this.ctx.currentTime : time;
        this.vco.frequency.setValueAtTime(freq, time);
        this.output.gain.linearRampToValueAtTime(1.0, time + 0.1);
    }

    noteOff(time? : number) {
        time = (typeof time === 'undefined') ? this.ctx.currentTime : time;
        this.output.gain.linearRampToValueAtTime(0.0, time + 0.1);
    }

    stop() {
        this.noteOff();
    }

    connect(target : AudioNode) {
        this.output.connect(target);
    }

}

export { Monotron };
