import { DOMPart } from '../dom/dom.js';
import { part, property, component } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { legacyTransform } from './legacy.js';

class SliderComponent extends PartComponent {
    @property({ type: Number, value: 0 })
    public value : number = 0;

    @property({ type: EventEmitter, value: () => new EventEmitter() })
    public changed : EventEmitter = new EventEmitter();
}

@part('slider')
export class SliderPart extends DOMPart<HTMLInputElement> {
    @component(SliderComponent)
    public core : SliderComponent;
    static transformLegacy(app : any) {
        legacyTransform(app);
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
        el.setAttribute('type', 'range');
        return el;
    }
    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        this._el.value = this.core.value.toString();
    }
    get value() {
        return this.core.value;
    }
    set value(v : number) {
        v = Math.max(0, Math.min(100, v));
        this.core.value = v;
        this.core.invalidate();
    }
    get onChange() {
        return this.core.changed.event;
    }
}
