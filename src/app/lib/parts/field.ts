/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

export interface IFieldComponent {
    [K : string] : any;
}

export class PartEditorField<T = void> {
    protected _component : IFieldComponent;
    protected _key : string;
    protected _el? : HTMLElement;
    static get propertyType() : any {
        return null;
    }
    constructor(component : IFieldComponent, key : string) {
        this._component = component;
        this._key = key;
    }
    getDOM() {
        return this._el;
    }
    getFullKeyName() {
        return this._key.replace(/([a-z])([A-Z]+)/g, '$1 $2').replace(/\b\w/g, l => l.toUpperCase());
    }
    getValue() : T {
        return this._component[this._key];
    }
    setValue(v : any) {
        this._component[this._key] = v;
    }
    dispose() {
        if (this._el && this._el.parentNode) {
            this._el.parentNode.removeChild(this._el);
        }
    }
}
