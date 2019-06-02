import { property } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';

export class TextInputComponent extends PartComponent {
    @property({ type: String, value: '' })
    public value : string = '';

    @property({ type: String, value: '' })
    public placeholder : string = '';

    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public change : EventEmitter = new EventEmitter();

    render(ctx: CanvasRenderingContext2D, el: HTMLElement) {
        const inputEl = el as HTMLInputElement;
        const halfHeight = inputEl.clientHeight / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#8c8c8c';
        ctx.strokeRect(0, 0, inputEl.clientWidth, inputEl.clientHeight);
        ctx.fillRect(0, 0, inputEl.clientWidth, inputEl.clientHeight + 5);
        const valuePresent = inputEl.value && inputEl.value.length > 0;
        // if placeholder, set text color to grey
        ctx.fillStyle = valuePresent ? '#000000' : '#8c8c8c';
        ctx.font = "16px Bariol";
        ctx.fillText(inputEl.value || inputEl.placeholder || '', halfHeight - 2, 6 + (halfHeight));
    }
}
