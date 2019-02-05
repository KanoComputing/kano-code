import { PartComponent } from '../component.js';
import { property } from '../decorators.js';

export class Transform extends PartComponent {
    @property({ type: Number, value: 0 })
    x : number = 0;
    @property({ type: Number, value: 0 })
    y : number = 0;
    @property({ type: Number, value: 1 })
    scale : number = 1;
    @property({ type: Number, value: 0 })
    rotation : number = 0;
}
