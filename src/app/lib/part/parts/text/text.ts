import { DOMPart } from '../dom/dom.js';
import { part, property, component } from '../../decorators.js';
import { PartComponent } from '../../component.js';

class TextComponent extends PartComponent {
    @property({ type: String, value: 'Text' })
    public value : string = 'Text';

    @property({ type: String, value: '#000000' })
    public color : string = '#000000';
}

@part('text')
export class TextPart extends DOMPart<HTMLDivElement> {
    @component(TextComponent)
    public core : TextComponent;
    constructor() {
        super();
        this.core = this._components.get('core') as TextComponent;

        this.core.invalidate();
    }
    getElement() : HTMLDivElement {
        return document.createElement('div');
    }
    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        this._el.textContent = this.core.value;
        this._el.style.color = this.core.color;
        this.core.apply();
    }
    get value() {
        return this.core.value;
    }
    set value(v : string) {
        this.core.value = v;
        this.core.invalidate();
    }
    get color() {
        return this.core.color;
    }
    set color(c : string) {
        this.core.color = c;
        this.core.invalidate();
    }
}
