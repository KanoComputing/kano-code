import { subscribeDOM } from '@kano/common/index.js';
import { DOMPart } from '../dom/dom.js';
import { part, component } from '../../decorators.js';
import { transformLegacySlider } from './legacy.js';
import { SliderComponent } from './slider-component.js';


@part('slider')
export class SliderPart extends DOMPart<HTMLInputElement> {
    @component(SliderComponent)
    public core : SliderComponent;
    static transformLegacy(app : any) {
        transformLegacySlider(app);
    }
    constructor() {
        super();
        this.core = this._components.get('core') as SliderComponent;
        subscribeDOM(this._el, 'input', () => {
            if (!this.core) {
                return;
            }
            this.core.value = parseInt(this._el.value, 10);
            this.core.changed.fire();
            this.core.invalidate();
        }, this, this.subscriptions);
        this.core.invalidate();
    }
    getElement() : HTMLInputElement {
        const el = document.createElement('input');
        el.title = 'slider';
        el.setAttribute('type', 'range');
        return el;
    }
    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        this._el.value = this.core.value.toString();
        this.core.apply();
    }
    get value() {
        return this.core.value;
    }
    set value(v : number) {
        v = Math.max(0, Math.min(100, v));
        this.core.value = v;
        this.core.invalidate();
    }
    onChange(callback : () => void) {
        this.core.changed.event(callback, null, this.userSubscriptions);
    }
}
