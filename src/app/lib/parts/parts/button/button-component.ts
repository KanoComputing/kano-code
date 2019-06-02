import { property } from '../../decorators.js';
import { Color } from '../../types/color.js';
import { PartComponent } from '../../component.js';
import { degreesToRadians } from '../../../util/conversions.js'

export class ButtonComponent extends PartComponent {
    @property({ type: String, value: 'Click Me!' })
    public label : string = 'Click Me!';
    
    @property({ type: Color, value: '#FF8F00' })
    public backgroundColor : string = '#FF8F00';

    @property({ type: Color, value: '#FFFFFF' })
    public textColor : string = '#FFFFFF';

    render(ctx: CanvasRenderingContext2D, el: HTMLElement) {
        const height = el.clientHeight;
        const halfHeight = height / 2;

        // circle on left side
        ctx.beginPath();
        ctx.arc(halfHeight, halfHeight, halfHeight, degreesToRadians(90), degreesToRadians(270));
        ctx.fill();
        ctx.closePath();
        // circle on right side
        ctx.beginPath();
        ctx.arc(
            (el.clientWidth) - halfHeight,
            halfHeight,
            halfHeight,
            degreesToRadians(270),
            degreesToRadians(450)
        );
        ctx.fill();
        ctx.closePath();
        // Main body of button
        ctx.fillRect(halfHeight - 1, 0, (el.clientWidth - height) + 2, height);
        // Text for button - values are a little hacked in because rendering the padding isn't accurate 
        // TODO: Find solution for opacity not rendering text perfectly
        ctx.fillStyle = el.style.color || '#ffffff';
        ctx.font = "16px Bariol";
        ctx.fillText(el.textContent || '', halfHeight - 2, 6 + (halfHeight));
    }
}