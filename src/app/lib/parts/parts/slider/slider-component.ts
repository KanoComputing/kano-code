import { property } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { EventEmitter } from '@kano/common/index.js';

export class SliderComponent extends PartComponent {
    @property({ type: Number, value: 0 })
    public value : number = 0;

    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public changed : EventEmitter = new EventEmitter();

    render(ctx: CanvasRenderingContext2D, el: HTMLElement) {
        const inputEl = el as HTMLInputElement;
        const value = inputEl.value && parseInt(inputEl.value) > 0 ? parseInt(inputEl.value) / 100 * inputEl.clientWidth : 0;
        ctx.fillStyle = '#8c8c8c';
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(0, 0, inputEl.clientWidth, 4);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = '#666666';
        ctx.fillStyle = '#dddddd';
        ctx.beginPath();
        ctx.arc(value, 2, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}
