import { Part, IPartContext } from '../../part.js';
import { IResourceInformation } from '../../../output/resources.js';
import { part, property, component } from '../../decorators.js';
import { subscribeDOM, EventEmitter } from '@kano/common/index.js';
import { PartComponent } from '../../component.js';
import { Sticker } from '../sticker/types.js';
import { transformLegacyMouse } from './legacy.js';

class MouseComponent extends PartComponent {
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public down : EventEmitter = new EventEmitter();
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public up : EventEmitter = new EventEmitter();
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public move : EventEmitter = new EventEmitter();
    @property({ type: Sticker, value: () => new Sticker(null) })
    public cursor : Sticker = new Sticker(null);
}

@part('mouse')
export class MousePart extends Part {
    private _scale : number = 1;
    private _rect : DOMRect|null = null;
    private _x : number = 0;
    private _y : number = 0;
    private _dx : number = 0;
    private _dy : number = 0;
    private _lastMoveEvent : number|null = null;
    private _root : HTMLElement|null = null;
    private _imageCache : Map<string, string> = new Map();
    private _stickers: IResourceInformation | undefined;
    @component(MouseComponent)
    public core : MouseComponent;
    static transformLegacy(app : any) {
        transformLegacyMouse(app);
    }
    constructor() {
        super();
        this.core = this._components.get('core') as MouseComponent;
        this._stickers = {
            categorisedResource: [],
            categoryEnum: [],
            getUrl: () => { return '' },
            getRandom: () => { return '' },
            getRandomFrom: () => { return '' },
            cacheValue: () => { return new HTMLImageElement() }
        };
    }
    onInstall(context : IPartContext) {
        // Listen to the resize event ot update the rect and scale
        context.dom.onDidResize(() => {
            this.resize(context);
        });
        subscribeDOM(context.dom.root, 'mousemove', (e : MouseEvent) => {
            let { pageX, pageY } = e;
            // In case no resize event is triggered before the mouse part is added
            if (!this._rect) {
                return;
            }
            // Adjust the cursor position by making the coordinates relative to the top left corner of the output
            // Also applies the scale
            const x = Math.max(0, Math.min(context.visuals.width, (pageX - this._rect.left) * this._scale));
            const y = Math.max(0, Math.min(context.visuals.height, (pageY - this._rect.top) * this._scale));

            // Record the current timestamp
            const now = Date.now();

            // When no event is received after 100ms, reset the mouse speed
            if (this._lastMoveEvent === null || now - this._lastMoveEvent > 100) {
                this._dx = 0;
                this._dy = 0;
            } else {
                this._dx = x - this._x;
                this._dy = y - this._y;
            }

            this._x = x;
            this._y = y;

            // Update last event time
            this._lastMoveEvent = now;
            
            this.core.move.fire();
        }, this, this.subscriptions);
        // On mouse down fire the down event. Also starts listening to the up event.
        // If a up event happens anywhere, fire the up event. This makes sure if the user clicks
        // in the canvas, then move the mouse ou and release it still triggers the up event
        subscribeDOM(context.dom.root, 'mousedown', () => {
            const upSub = subscribeDOM(window as unknown as HTMLElement, 'mouseup', () => {
                upSub.dispose();
                this.core.up.fire();
            });
            this.core.down.fire();
        }, this, this.subscriptions);
        // Trigger an initial resize to populate the scale and rect
        this.resize(context);
        this.core.onDidInvalidate(() => this.render(), this, this.subscriptions);
        this._root = context.dom.root;
        
        if (context.resources.get('stickers')) {
            this._stickers = context.resources.get('stickers');
        }
    }
    resize(context : IPartContext) {
        this._rect = context.dom.root.getBoundingClientRect() as DOMRect;
        this._scale = context.visuals.width / this._rect.width;
    }
    render() {
        if (!this.core.invalidated) {
            return;
        }
        if (!this._root) {
            return;
        }
        const sticker = this.core.cursor.get();
        if (sticker && this._stickers && this._stickers.getUrl(sticker)) {
            this.loadImage(this._stickers.getUrl(sticker))
                .then((url) => {
                    this._root!.style.cursor = `url('${url}'), auto`;
                });
        } else {
            this._root.style.cursor = '';
        }
        this.core.apply();
    }
    onDown(callback : () => void) {
        return this.core.down.event(callback, null, this.userSubscriptions);
    }
    onUp(callback : () => void) {
        return this.core.up.event(callback, null, this.userSubscriptions);
    }
    onMove(callback : () => void) {
        return this.core.move.event(callback, null, this.userSubscriptions);
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get dx() {
        return this._dx;
    }
    get dy() {
        return this._dy;
    }
    set cursor(c : string) {
        this.core.cursor.set(c);
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
    loadImage(url : string) : Promise<string> {
        if (this._imageCache.has(url)) {
            return Promise.resolve(this._imageCache.get(url)!);
        }
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                let canvas = document.createElement('canvas'),
                    ctx;
                canvas.width = 30;
                canvas.height = 30;
                ctx = canvas.getContext('2d');
                ctx!.drawImage(img, 0, 0, 30, 30);
                this._imageCache.set(url, canvas.toDataURL());
                resolve(this._imageCache.get(url));
            };
            img.onerror = reject;
            img.src = url;
        });
    }
}