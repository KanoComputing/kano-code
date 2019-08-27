import { part, component } from '../../decorators.js';
import { IResourceInformation } from '../../../output/resources.js';
import { DOMPart } from '../dom/dom.js';
import { transformLegacySticker } from './legacy.js';
import { StickerComponent } from './sticker-component.js';
import { IPartContext } from '../../part.js';

@part('sticker')
export class StickerPart extends DOMPart<HTMLDivElement> {
    private _stickers: IResourceInformation | undefined;
    @component(StickerComponent)
    public core : StickerComponent;
    static transformLegacy(app : any) {
        transformLegacySticker(app);
    }
    constructor() {
        super();
        this._stickers = {
            categorisedResource: [],
            categoryEnum: [],
            getUrl: () => { return '' },
            getRandom: () => { return '' },
            getRandomFrom: () => { return '' },
            cacheValue: () => { return new HTMLImageElement() }
        };
        this.core = this._components.get('core') as StickerComponent;
        this.core.invalidate();
    }
    onInstall(context : IPartContext) {
        super.onInstall(context);
        if (context.resources.get('stickers')) {
            this._stickers = context.resources.get('stickers');
        }
        if (this._stickers && this._stickers.default) {
            this.core.image.set(this._stickers.default)
            this.core.invalidate();
        }
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
        if (sticker && this._stickers) {
            this._el.style.backgroundImage = `url(${this._stickers.getUrl(sticker)})`;
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
        
        if (sticker && this._stickers) {
            url = this._stickers.getUrl(sticker);
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
    random(id : string) {
        if (!this._stickers) {
            return '';
        }
        if (id === 'all') {
            return this._stickers.getRandom()
        }
        return this._stickers.getRandomFrom(id);
    }
}
