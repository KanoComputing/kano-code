/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import Tone from '../../../../../modules/tone.js';
import { EventEmitter } from '@kano/common/index.js';

export class Sequencer {
    public steps : boolean[];
    public loop : Tone.Sequence;
    private _onDidStep : EventEmitter<number> = new EventEmitter();
    private _onDidStepsChange : EventEmitter = new EventEmitter();
    private _onHit : EventEmitter<number> = new EventEmitter();
    get onDidStep() { return this._onDidStep.event; }
    get onDidStepsChange() { return this._onDidStepsChange.event; }
    get onHit() { return this._onHit.event; }
    constructor(size : number, bpm : number) {
        const columns = [];
        this.steps = [];
        for (let i = 0; i < size; i += 1) {
            columns.push(i);
            this.steps.push(false);
        }
        this.loop = new Tone.Sequence((time, col) => {
            this._onDidStep.fire(col);
            if (this.steps[col]) {
                this._onHit.fire(time);
            }
        }, columns, `${size}n`);
        if (Tone.Transport.state !== 'started') {
            Tone.Transport.start();
        }
        this.setBPM(bpm);
    }
    setBPM(v : number) {
        const rate = v / Tone.Transport.bpm.value;
        this.loop.playbackRate = rate;
    }
    setSteps(steps : boolean[]) {
        this.steps = steps;
    }
    start() {
        this.loop.start();
    }
    stop() {
        this.loop.stop();
    }
    shuffle() {
        const newArray = [];
        for (let i = 0; i < this.steps.length; i += 1) {
            newArray.push(Math.random() < 0.5);
        }
        this.setSteps(newArray);
        this._onDidStepsChange.fire();
    }
    dispose() {
        this.stop();
        this._onDidStep.dispose();
        this._onHit.dispose();
        this._onDidStepsChange.dispose();
    }
}

export default Sequencer;
