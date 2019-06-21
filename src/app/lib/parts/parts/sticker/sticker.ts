import { part, component } from '../../decorators.js';
import { DOMPart } from '../dom/dom.js';
import { stamps } from '../../../modules/stamp/data.js';
import { reduceAllImages, resolve } from '../../../util/image-stamp.js';
import { transformLegacySticker } from './legacy.js';
import { StickerComponent } from './sticker-component.js';
import * as StampFunctions from '../../../modules/stamp/stamp.js';

const all = reduceAllImages(stamps);

@part('sticker')
export class StickerPart extends DOMPart<HTMLDivElement> {
    @component(StickerComponent)
    public core : StickerComponent;
    static transformLegacy(app : any) {
        transformLegacySticker(app);
    }
    static get items() { return stamps; }
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
            this._el.style.backgroundImage = `url(${resolve(all[sticker])})`;
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
            url = resolve(all[sticker]);
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
        return StampFunctions.random;
    }
    randomFrom(setId : string) {
        return StampFunctions.randomFrom(setId);
    }
}
