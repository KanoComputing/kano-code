import { subscribeDOM, EventEmitter } from '@kano/common/index.js';
import { button } from '@kano/styles/button.js';
import * as parts from '../index.js';
import { IPartContext } from '../part.js';
import { Color } from '../types/color.js';
import { PartComponent } from '../component.js';

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

export class ButtonPart extends parts.DOMPart {
    static get type() {
        return 'button';
    }
    private static stylesAdded : boolean = false;
    private static addStyles(root : HTMLElement) {
        if (ButtonPart.stylesAdded) {
            return;
        }
        root.appendChild(button.content.cloneNode(true));
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
    constructor() {
        super();
        subscribeDOM(this._el, 'click', () => this.core.click.fire(), null, this.subscriptions);
    }
    static get components() {
        return {
            core: ButtonComponent,
        }
    }
    onClick(callback : () => void) {
        this.core.click.event(callback);
    }
    setBackgroundColor(c : string) {
        this.core.backgroundColor = c;
        this.core.invalidate();
    }
    render() {
        super.render();
        if (this.core.invalidated) {
            this._el.textContent = this.core.text;
            this._el.style.backgroundColor = this.core.backgroundColor;
        }
    }
    dispose() {
        super.dispose();
        this.subscriptions.dispose();
    }
}