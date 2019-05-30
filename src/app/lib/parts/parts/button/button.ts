import { button } from '@kano/styles/button.js';
import { DOMPart } from '../dom/dom.js';
import { IPartContext } from '../../part.js';
import { part, component } from '../../decorators.js';
import { transformLegacyButton } from './legacy.js';
import { ButtonComponent } from './button-component.js';

@part('button')
export class ButtonPart extends DOMPart {
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
    static transformLegacy(app : any) {
        transformLegacyButton(app);
    }
    constructor() {
        super();
        this.core = this._components.get('core') as ButtonComponent;
        this.core.invalidate();
    }
    onInstall(context : IPartContext) {
        super.onInstall(context);
        ButtonPart.addStyles(context.dom.root);
    }
    getElement() {
        const el = document.createElement('button');
        el.classList.add('btn');
        el.title = 'button';
        return el;
    }
    render() {
        super.render();
        if (this.core && this.core.invalidated) {
            this._el.textContent = this.core.label;
            this._el.style.backgroundColor = this.core.backgroundColor;
            this._el.style.color = this.core.textColor;
            this.core.apply();
        }
    }

    get label() {
        return this.core.label;
    }
    set label(label : string) {
        this.core.label = label;
        this.core.invalidate();
    }
    set color(color : string) {
        this.core.textColor = color;
        this.core.invalidate();
    }
    get color() {
        return this.core.textColor;
    }
    set background(c : string) {
        this.core.backgroundColor = c;
        this.core.invalidate();
    }
    get background() {
        return this.core.backgroundColor;
    }
}
