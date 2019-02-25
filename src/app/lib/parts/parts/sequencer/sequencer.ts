import { Part } from '../../part.js';
import { part, property, component } from '../../decorators.js';
import { EventEmitter } from '@kano/common/index.js';
import { PartComponent } from '../../component.js';
import Sequencer from './tone.js';

class SequencerComponent extends PartComponent {
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public step : EventEmitter = new EventEmitter();
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public hit : EventEmitter = new EventEmitter();
}

export interface IStepEvent {
    id : string;
    column : number;
}

@part('sequencer')
export class SequencerPart extends Part {
    public sequencers : Map<string, Sequencer> = new Map();
    @component(SequencerComponent)
    public core : SequencerComponent;
    private _onDidStep : EventEmitter<IStepEvent> = new EventEmitter();
    get onDidStep() { return this._onDidStep.event; }
    constructor() {
        super();
        this.core = this._components.get('core') as SequencerComponent;
    }
    onStop() {
        super.onStop();
        this.sequencers.forEach(seq => seq.dispose);
        this.sequencers.clear();
    }
    onHit(id : string, cb : () => void) {
        const seq = new Sequencer(8, 120);
        const seqId = id;
        this.sequencers.set(seqId, seq);
        id += 1;
        seq.onDidStep((col) => {
            this._onDidStep.fire({ id: seqId, column: col });
        });
        seq.onDidHit(cb);
        seq.start();
    }
}