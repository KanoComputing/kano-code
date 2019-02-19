import { PartComponent } from '../component.js';
import { property } from '../decorators.js';
import { EventEmitter } from '@kano/common/index.js';

export class Transform extends PartComponent {
    @property({ type: Number, value: 0 })
    x : number = 0;
    @property({ type: Number, value: 0 })
    y : number = 0;
    @property({ type: Number, value: 1 })
    scale : number = 1;
    @property({ type: Number, value: 0 })
    rotation : number = 0;
    @property({ type: Number, value: 1 })
    opacity : number = 1;
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public click : EventEmitter = new EventEmitter();
}
