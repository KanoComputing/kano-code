/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { property } from '../../decorators.js';
import { PartComponent } from '../../component.js';

export class TextComponent extends PartComponent {
    @property({ type: String, value: 'Text' })
    public value : string = 'Text';

    @property({ type: String, value: '#000000' })
    public color : string = '#000000';

    render(ctx: CanvasRenderingContext2D, el: HTMLElement) {
        const halfHeight = el.clientHeight / 2;
        ctx.fillStyle = el.style.color || '#ffffff';
        ctx.font = "16px Bariol";
        ctx.fillText(el.textContent || '', halfHeight - 2, 6 + (halfHeight));
    }
}
