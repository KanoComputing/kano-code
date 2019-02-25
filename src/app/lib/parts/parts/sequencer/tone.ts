import 'tone/build/Tone.js';
import { EventEmitter } from '@kano/common/index.js';

export class Sequencer {
    public steps : boolean[];
    public loop : window.Tone.Sequence;
    private _onDidStep : EventEmitter<number> = new EventEmitter();
    private _onDidHit : EventEmitter<number> = new EventEmitter();
    get onDidStep() { return this._onDidStep.event; }
    get onDidHit() { return this._onDidHit.event; }
    constructor(size : number, bpm : number) {
        const columns = [];
        this.steps = [];
        for (let i = 0; i < size; i += 1) {
            columns.push(i);
            this.steps.push(false);
        }
        this.loop = new window.Tone.Sequence((time, col) => {
            this._onDidStep.fire(col);
            if (this.steps && this.steps[col]) {
                this._onDidHit.fire(time);
            }
        }, columns, `${size}n`);
        window.Tone.Transport.start();
        this.setBPM(bpm);
    }
    setBPM(v : number) {
        window.Tone.Transport.bpm.value = v;
    }
    setSteps(steps : boolean[]) {
        this.steps = steps;
    }
    enableStep(index : number) {
        this.steps[index] = true;
    }
    disableStep(index : number) {
        this.steps[index] = false;
    }
    start() {
        this.loop.start();
    }
    stop() {
        this.loop.stop();
    }
    dispose() {
        this.loop.stop();
        this._onDidStep.dispose();
        this._onDidHit.dispose();
    }
}

export default Sequencer;
