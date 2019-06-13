import { part, component } from '../../decorators.js';
import { DOMPart } from '../dom/dom.js';
import { stickers } from './data.js';
import Output from '../../../output/output.js';
import { join } from '../../../util/path.js';
import { transformLegacySticker } from './legacy.js';
import { StickerComponent } from './sticker-component.js';

const all = stickers.reduce<{ [K : string] : string }>((acc, item) => Object.assign(acc, item.stickers), {});

const ASSET_URL_PREFIX_KEY = 'sticker:base-url';

@part('sticker')
export class StickerPart extends DOMPart<HTMLDivElement> {
    @component(StickerComponent)
    public core : StickerComponent;
    static transformLegacy(app : any) {
        transformLegacySticker(app);
    }
    static get items() { return stickers; }
    static resolve(item : string) {
        const prefix = Output.config.get(ASSET_URL_PREFIX_KEY, '/assets/part/stickers/');
        return encodeURI(join(prefix, item));
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
        el.title = 'sticker';
        return el;
    }
    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        
        const sticker = this.core.image.get();
        if (sticker && all[sticker]) {
            this._el.style.backgroundImage = `url(${StickerPart.resolve(all[sticker])})`;
        }
        this.core.apply();
    }
    renderComponents(ctx: CanvasRenderingContext2D) : Promise<void> {
        const transform = this._components.get('transform');
        let url = '';
        if (transform) {
            this.applyTransform(ctx);
        }
        const sticker = this.core.image.get();
        if (sticker && all[sticker]) {
            url = StickerPart.resolve(all[sticker]);
        }
        const imageLoaded = new Promise((res) => {
            const img = new Image();
            img.onload = () => {
                this._components.forEach(component => component.render(ctx, img));
                this.resetTransform(ctx);
                res();
            }
            img.crossOrigin = "Anonymous";
            img.src = url;
        }) as Promise<void>;
        return imageLoaded;
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
