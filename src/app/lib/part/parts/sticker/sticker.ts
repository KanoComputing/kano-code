import { part, property, component } from '../../decorators.js';
import { DOMPart } from '../dom/dom.js';
import { PartComponent } from '../../component.js';
import { Sticker } from './types.js';
import { stickers } from './data.js';

const all = stickers.reduce<{ [K : string] : string }>((acc, item) => Object.assign(acc, item.stickers), {});

class StickerComponent extends PartComponent {
    @property({ type: Sticker, value: () => new Sticker(StickerPart.defaultSticker) })
    public image : Sticker = new Sticker(StickerPart.defaultSticker);
}

@part('sticker')
export class StickerPart extends DOMPart<HTMLDivElement> {
    @component(StickerComponent)
    public core : StickerComponent;
    static get items() { return stickers; }
    static resolve(item : string) {
        return encodeURI(`/assets/part/stickers/${item}`);
    }
    static get defaultSticker() { return 'crocodile'; }
    constructor() {
        super();
        this.core = this._components.get('core') as StickerComponent;
        this.core.invalidate();
    }
    getElement() : HTMLDivElement {
        const el = document.createElement('div');
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        return el;
    }
    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        
        const sticker = this.core.image.get();
        if (sticker) {
            this._el.style.backgroundImage = `url(${StickerPart.resolve(all[sticker])})`;
        }
        this.core.apply();
    }
    set image(id : string) {
        this.core.image.set(id);
        this.core.invalidate();
    }
    random() {
        const allKeys = Object.keys(all);
        const idx = Math.floor(Math.random() * allKeys.length);
        return allKeys[idx];
    }
    randomFrom(setId : string) {
        const set = stickers.find(item => item.id === setId);
        if (!set) {
            return StickerPart.defaultSticker;
        }
        const allKeys = Object.keys(set.stickers);
        const idx = Math.floor(Math.random() * allKeys.length);
        return allKeys[idx];
    }
}
