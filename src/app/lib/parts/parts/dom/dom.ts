import { Part, IPartContext } from '../../part.js';
import { component } from '../../decorators.js';
import { Transform } from '../../components/transform.js';
import { subscribeDOM } from '@kano/common/index.js';

type TurnType = 'clockwise'|'counterclockwise'|'to';

export abstract class DOMPart<T extends HTMLElement = HTMLElement> extends Part {
    protected _el : T;
    @component(Transform)
    public transform : Transform;
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
        context.dom.root.appendChild(this._el);
    }
    render() {
        if (this.transform.invalidated) {
            this._el.style.transform = `translate(${this.transform.x}px, ${this.transform.y}px) scale(${this.transform.scale}, ${this.transform.scale}) rotate(${this.transform.rotation}deg)`;
            this._el.style.opacity = this.transform.opacity.toString();
        }
        this.transform.apply();
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
        return this.transform.opacity;
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
