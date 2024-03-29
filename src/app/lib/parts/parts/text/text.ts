/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { DOMPart } from '../dom/dom.js';
import { part, component } from '../../decorators.js';
import { transformLegacyText } from './legacy.js';
import { TextComponent } from './text-component.js';

@part('text')
export class TextPart extends DOMPart<HTMLDivElement> {
    @component(TextComponent)
    public core : TextComponent;
    static transformLegacy(app : any) {
        transformLegacyText(app);
    }
    constructor() {
        super();
        this.core = this._components.get('core') as TextComponent;

        this.core.invalidate();
    }
    getElement() : HTMLDivElement {
        const el = document.createElement('div');
        el.title = 'text';
        return el;
    }
    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        this._el.textContent = this.core.value;
        this._el.style.color = this.core.color;
        this._el.style.fontFamily = this.core.font || 'Bariol';
        this._el.style.fontSize = '16px';
        (this._el.style as any).willChange = 'unset';
        this.core.apply();
    }
    get value() {
        return this.core.value;
    }
    set value(v : string) {
        this.core.value = v;
        this.core.invalidate();
        this.updateSize();
    }
    get color() {
        return this.core.color;
    }
    set color(c : string) {
        this.core.color = c;
        this.core.invalidate();
    }
    get font() {
        return this.core.font;
    }
    set font(f: string) {
        this.core.font = f;
        this.core.invalidate();
    }
}
