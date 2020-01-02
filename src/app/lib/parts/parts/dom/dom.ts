import { Part, IPartContext } from '../../part.js';
import { component } from '../../decorators.js';
import { Transform } from '../../components/transform.js';
import { subscribeDOM } from '@kano/common/index.js';

type TurnType = 'clockwise'|'counterclockwise'|'to';

export abstract class DOMPart<T extends HTMLElement = HTMLElement> extends Part {
    protected _el : T;
    @component(Transform)
    public transform : Transform;
    private _rect : DOMRect|null = null;
    private _visuals : { canvas: HTMLCanvasElement; width: number; height: number; }|null = null;
    private _canvasScale : number|null = null;
    protected size : { width: number, height : number } = { width : 0, height: 0 };
    constructor() {
        super();
        this.transform = this._components.get('transform') as Transform;
        this._el = this.getElement();
        (this._el.style as any).willChange = 'transform';
        this._el.style.transformOrigin = 'center center';
        this._el.style.position = 'absolute';
        this._el.style.top = '0';
        this._el.style.left = '0';
        this._components.forEach((component) => {
            component.onDidInvalidate(this.render, this, this.subscriptions);
        });
        subscribeDOM(this._el, 'click', () => {
            this.transform.click.fire();
        }, this, this.subscriptions);
    }
    onInstall(context : IPartContext) {
        this._visuals = context.visuals;
        context.dom.onDidResize(() => {
            this.resize(context);
        });
        // Trigger an initial resize to populate the scale and rect
        this.resize(context);
        context.dom.root.appendChild(this._el);
        this.transform.invalidate();
    }
    resize(context : IPartContext) {
        if (!this._visuals) {
            return;
        }
        const scale = Math.min(this._visuals.canvas.offsetWidth / this._visuals.width, this._visuals.canvas.offsetHeight / this._visuals.height);
        if (this._canvasScale !== scale) {
            this._canvasScale = scale;
            this.transform.invalidate();
        }
        this._canvasScale = scale;
        this._rect = context.dom.root.getBoundingClientRect() as DOMRect;
    }
    render() {
        // Don't render until we got the output rect
        if (!this._rect || !this._visuals) {
            return;
        }
        if (this.transform.invalidated && this._canvasScale) {
            // this.size / 2 is for transforming to center of image instead of corner
            // the scale is multiplied by 2 to make parts more visible
            const transform = {
                x: (this.transform.x * this._canvasScale) - (this.size.width / 2),
                y: (this.transform.y * this._canvasScale) - (this.size.height / 2),
                scale: this.transform.scale * this._canvasScale * 2,
            };
            this._el.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}, ${transform.scale}) rotate(${this.transform.rotation}deg)`;
            this._el.style.opacity = this.transform.opacity.toString();
        }
        this.transform.apply();
        // Update the size once
        if (this.size.width === 0) {
            this.updateSize();
        }
    }
    renderComponents(ctx: CanvasRenderingContext2D) : Promise<void> {
        this.applyTransform(ctx);
        this._components.forEach(component => component.render(ctx, this._el));
        this.resetTransform(ctx);
        return Promise.resolve();
    }
    applyTransform(ctx: CanvasRenderingContext2D) {
        const { _el } = this;
        const {
            x,
            y,
            scaleX,
            scaleY,
            rotation,
        } = this.transform;
        const width = _el.clientWidth;
        const height = _el.clientHeight;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        ctx.fillStyle = _el.style.backgroundColor || '#000000';
        // Translate to the middle of the element, then apply scale and rotation
        ctx.translate(x + halfWidth, y + halfHeight);
        ctx.rotate((Math.PI / 180) * rotation);
        ctx.scale(scaleX, scaleY);
        ctx.translate(-halfWidth, -halfHeight);
        ctx.globalAlpha = parseFloat(_el.style.opacity || '1');
    }
    updateSize() {
        this.size = { width: this._el.offsetWidth, height: this._el.offsetHeight };
    }
    /**
     * Actual width, including the scale
     **/
    getCollidableWidth() {
        return this.size.width * (this.transform.scale);
    }
    /**
     * Actual height, including the scale
     **/
    getCollidableHeight() {
        return this.size.height * (this.transform.scale);
    }
    getCollidableRect() {
        let x = 0;
        let y = 0;
        if (this._visuals && this._rect) {
            x = this.transform.x / this._visuals.width * this._rect.width;
            y = this.transform.y / this._visuals.height * this._rect.height;
        }
        return {
            x: x - (((this.size.width * this.transform.scale) / 2) - (this.size.width / 2)),
            y: y - (((this.size.height * this.transform.scale) / 2) - (this.size.height / 2)),
            width: this.getCollidableWidth(),
            height: this.getCollidableHeight()
        };
    }
    abstract getElement() : T
    turnCW(a : number) {
        this.transform.rotation += a;
        this.transform.invalidate();
    }
    turnCCW(a : number) {
        this.transform.rotation -= a;
        this.transform.invalidate();
    }
    moveAlong(distance : number) {
        const direction = (this.transform.rotation || 0) * Math.PI / 180;
        const alongY = Math.round(distance * Math.sin(direction));
        const alongX = Math.round(distance * Math.cos(direction));
        this.move(alongX, alongY);
    }
    move(x : number, y : number) {
        this.transform.x += x;
        this.transform.y += y;
        this.transform.invalidate();
    }
    moveTo(x : number, y : number) {
        this.transform.x = x;
        this.transform.y = y;
        this.transform.invalidate();
    }
    setScale(scale : number) {
        this.transform.scale = scale / 100;
        this.transform.invalidate();
    }
    set opacity(o : number) {
        o = Math.max(0, Math.min(100, o)) / 100;
        this.transform.opacity = o;
        this.transform.invalidate();
    }
    get opacity() {
        // User facing opacity values are 0-100
        return this.transform.opacity * 100;
    }
    get x() {
        return this.transform.x;
    }
    get y() {
        return this.transform.y;
    }
    get scale() {
        return this.transform.scale * 100;
    }
    get rotation() {
        return this.transform.rotation;
    }
    set rotation(a : number) {
        this.transform.rotation = a;
        this.transform.invalidate();
    }
    onClick(callback : () => void) {
        this.transform.click.event(callback, null, this.userSubscriptions);
    }
    dispose() {
        super.dispose();
        if (this._el.parentNode) {
            this._el.parentNode.removeChild(this._el);
        }
    }
}
