import { subscribeDOM, EventEmitter } from '@kano/common/index.js';
import { button } from '@kano/styles/button.js';
import * as parts from '../index.js';
import { IPartContext } from '../../part.js';
import { Color } from '../../types/color.js';
import { PartComponent } from '../../component.js';
import { part, component, property } from '../../decorators.js';

class ButtonComponent extends PartComponent {
    @property({ type: String, value: 'Click Me!' })
    public label : string = 'Click Me!';
    
    @property({ type: Color, value: '#FF8F00' })
    public backgroundColor : string = '#FF8F00';

    @property({ type: Color, value: '#FFFFFF' })
    public textColor : string = '#FFFFFF';

    @property({ type: EventEmitter, value: () => new EventEmitter() })
    public click : EventEmitter = new EventEmitter();
}

@part('button')
export class ButtonPart extends parts.DOMPart {
    private static stylesAdded : boolean = false;
    /**
     * Adds the button styles to a given DOM element
     * @param root Target DOM element for the styles to be added to
     */
    private static addStyles(root : HTMLElement) {
        // Only add once
        if (ButtonPart.stylesAdded) {
            return;
        }
        root.appendChild(button.content.cloneNode(true));
    }
    @component(ButtonComponent)
    public core : ButtonComponent;
    constructor() {
        super();
        this.core = this._components.get('core') as ButtonComponent;
        subscribeDOM(this._el, 'click', () => {
            if (!this.core) {
                return;
            }
            this.core.click.fire();
        }, this, this.subscriptions);

        this.core.invalidate();
    }
    onInstall(context : IPartContext) {
        super.onInstall(context);
        ButtonPart.addStyles(context.dom.root);
    }
    getElement() {
        const el = document.createElement('button');
        el.classList.add('btn');
        return el;
    }
    render() {
        super.render();
        if (this.core && this.core.invalidated) {
            this._el.textContent = this.core.label;
            this._el.style.backgroundColor = this.core.backgroundColor;
            this._el.style.color = this.core.textColor;
        }
    }
    dispose() {
        super.dispose();
        this.subscriptions.dispose();
    }
    getLabel() {
        return this.core.label;
    }
    setLabel(label : string) {
        this.core.label = label;
        this.core.invalidate();
    }
    setTextColor(color : string) {
        this.core.textColor = color;
        this.core.invalidate();
    }
    setBackgroundColor(c : string) {
        this.core.backgroundColor = c;
        this.core.invalidate();
    }
    onClick(callback : () => void) {
        if (!this.core) {
            return;
        }
        this.core.click.event(callback);
    }
}