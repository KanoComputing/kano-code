import { property } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { Sticker } from './types.js';
import { StickerPart } from './sticker.js';

export class StickerComponent extends PartComponent {
    @property({ type: Sticker, value: () => new Sticker(StickerPart.defaultSticker) })
    public image : Sticker = new Sticker(StickerPart.defaultSticker);
    render(ctx : CanvasRenderingContext2D, el : HTMLElement) {
        const img = el as HTMLImageElement;
        ctx.drawImage(img, 0, 0, 100, 100);
    }
}
