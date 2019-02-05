import * as components from '../components/index.js';
import { Part, IPartContext } from '../part.js';
import { PartComponent } from '../component.js';
import { component } from '../decorators.js';

interface IPartComponents {
    [K : string] : Type<PartComponent>;
}

export class DOMPart extends Part {
    protected _el : HTMLElement;
    @component(components.Transform)
    public transform : components.Transform;
    constructor() {
        super();
        this.transform = this._components.get('transform') as components.Transform;
        this._el = this.getElement();
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
    dispose() {
        super.dispose();
        if (this._el.parentNode) {
            this._el.parentNode.removeChild(this._el);
        }
    }
}
