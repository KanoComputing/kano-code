import { subscribeDOM, EventEmitter } from '@kano/common/index.js';
import { button } from '@kano/styles/button.js';
import * as parts from '../index.js';
import { IPartContext, Part } from '../part.js';
import { Color } from '../types/color.js';
import { PartComponent } from '../component.js';
import { part, component } from '../decorators.js';

class ButtonComponent extends PartComponent {
    static get properties() {
        return {
            text: {
                type: String,
                value: 'Click Me!',
            },
            backgroundColor: {
                type: Color,
                value: 'red',
            },
            click: {
                type: EventEmitter,
                value: () => new EventEmitter(),
            }
        }
    }
}

@part('button', 'Button')
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
    onClick(callback : () => void) {
        if (!this.core) {
            return;
        }
        this.core.click.event(callback);
    }
    setBackgroundColor(c : string) {
        if (!this.core) {
            return;
        }
        this.core.backgroundColor = c;
        this.core.invalidate();
    }
    render() {
        super.render();
        if (this.core && this.core.invalidated) {
            this._el.textContent = this.core.text;
            this._el.style.backgroundColor = this.core.backgroundColor;
        }
    }
    dispose() {
        super.dispose();
        this.subscriptions.dispose();
    }
}