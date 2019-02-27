import { Part, IPartContext } from '../../part.js';
import { part, property, component } from '../../decorators.js';
import { EventEmitter } from '@kano/common/index.js';
import { PartComponent } from '../../component.js';
import Sequencer from './tone.js';

class SequencerComponent extends PartComponent {

    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public step : EventEmitter = new EventEmitter();

    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public hit : EventEmitter = new EventEmitter();

    @property({ type: Number, value: 120 })
    public bpm : number = 120;
}

export interface IStepEvent {
    id : string;
    column : number;
}

export interface IStepsChangeEvent {
    id : string;
    steps : boolean[];
}

@part('sequencer')
export class SequencerPart extends Part {
    public sequencers : Map<string, Sequencer> = new Map();
    @component(SequencerComponent)
    public core : SequencerComponent;
    private _onDidStep : EventEmitter<IStepEvent> = new EventEmitter();
    private _onDidStepsChange : EventEmitter<IStepsChangeEvent> = new EventEmitter();
    private _onDidChangeSequencers : EventEmitter = new EventEmitter();
    get onDidStep() { return this._onDidStep.event; }
    get onDidStepsChange() { return this._onDidStepsChange.event; }
    get onDidChangeSequencers() { return this._onDidChangeSequencers.event; }
    constructor() {
        super();
        this.core = this._components.get('core') as SequencerComponent;

        this.core.onDidInvalidate(() => {
            this.render();
        }, this, this.subscriptions);
    }
    render() {
        if (!this.core.invalidated) {
            return;
        }
        this.sequencers.forEach((sequencer) => {
            sequencer.setBPM(this.core.bpm);
        });
        this.core.apply();
    }
    onStop() {
        super.onStop();
        this.sequencers.forEach(seq => seq.dispose());
        this.sequencers.clear();
        this._onDidChangeSequencers.fire();
    }
    createSteps(id : string, steps : number[]) {
        // Create a new sequencer
        const seq = new Sequencer(steps.length, this.core.bpm);
        // Update its steps from the sequence store
        seq.setSteps(steps.map(num => !!num));
        // Copy the id locally
        const seqId = id;
        this.sequencers.set(seqId, seq);
        seq.onDidStep((col) => {
            this._onDidStep.fire({ id: seqId, column: col });
        });
        seq.onDidStepsChange(() => {
            this._onDidStepsChange.fire({ id: seqId, steps: seq.steps });
        });
        seq.start();
        this._onDidChangeSequencers.fire();
        return seq;
    }
    set bpm(value : number) {
        const sanitized = Math.max(1, Math.min(360, value));
        this.core.bpm = sanitized;
        this.core.invalidate();
    }
    get bpm() {
        return this.core.bpm;
    }
    start() {
        this.sequencers.forEach(s => s.start());
    }
    stop() {
        this.sequencers.forEach(s => s.stop());
    }
    shuffle() {
        this.sequencers.forEach(s => s.shuffle());
    }
}