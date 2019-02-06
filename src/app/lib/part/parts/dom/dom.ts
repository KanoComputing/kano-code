import { Part, IPartContext } from '../../part.js';
import { component } from '../../decorators.js';
import { Transform } from '../../components/transform.js';

export class DOMPart extends Part {
    protected _el : HTMLElement;
    @component(Transform)
    public transform : Transform;
    constructor() {
        super();
        this.transform = this._components.get('transform') as Transform;
        this._el = this.getElement();
        this._el.style.transformOrigin = 'center center';
        this._el.style.position = 'absolute';
        this._el.style.top = '0';
        this._el.style.left = '0';
        this._components.forEach((component) => {
            component.onDidInvalidate(this.render, this, this.subscriptions);
        });
    }
    onInstall(context : IPartContext) {
        context.dom.root.appendChild(this._el);
    }
    render() {
        if (this.transform.invalidated) {
            this._el.style.transform = `translate(${this.transform.x}px, ${this.transform.y}px) scale(${this.transform.scale}, ${this.transform.scale}) rotate(${this.transform.rotation}deg)`;
        }
        this.transform.apply();
    }
    getElement() : HTMLElement {
        return document.createElement('div');
    }
    setRotation(a : number) {
        this.transform.rotation = a;
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
    dispose() {
        super.dispose();
        if (this._el.parentNode) {
            this._el.parentNode.removeChild(this._el);
        }
    }
}
