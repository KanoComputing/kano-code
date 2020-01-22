import { property } from '../../decorators.js';
import { PartComponent } from '../../component.js';

export class JoystickComponent extends PartComponent {

    @property({ type: Number, value: 0 })
    public stickX : number = 0;

    @property({ type: Number, value: 0 })
    public stickY : number = 0;

}
