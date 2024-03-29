/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { subscribeDOM, IDisposable } from '@kano/common/index.js';
import { PartEditorField, IFieldComponent } from '../field.js';

export class StringPartEditorField<T = string> extends PartEditorField<T|string> {
    protected _label : HTMLLabelElement;
    protected _input : HTMLInputElement;
    protected subscriptions : IDisposable[] = [];
    static get propertyType() : any {
        return String;
    }
    constructor(component : IFieldComponent, key : string) {
        super(component, key);
        this._el = document.createElement('div');
        this._label = document.createElement('label');
        this._label.innerText = this.getFullKeyName();
        this._input = document.createElement('input');
        this._input.value = this._component[this._key];
        subscribeDOM(this._input, 'input', this._onKeyUp, this, this.subscriptions);
        this._el.appendChild(this._label);
        this._el.appendChild(this._input);
    }
    _getInputValue() : T|string {
        return this._input.value;
    }
    _onKeyUp() {
        this.setValue(this._getInputValue());
        this._component.invalidate();
    }
    dispose() {
        super.dispose();
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}