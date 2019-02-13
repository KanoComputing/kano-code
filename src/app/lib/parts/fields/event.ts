import { EventEmitter, subscribeTimeout, IDisposable } from '@kano/common/index.js';
import { PartEditorField, IFieldComponent } from '../field.js';

export class EventPartEditorField<T> extends PartEditorField<EventEmitter<T>> {
    private _label : HTMLLabelElement;
    private _flash : HTMLSpanElement;
    private _timer? : IDisposable;
    static get propertyType() : any {
        return EventEmitter;
    }
    constructor(component : IFieldComponent, key : string) {
        super(component, key);
        this._el = document.createElement('div');
        this._label = document.createElement('label');
        this._label.innerText = this.getFullKeyName();
        this._flash = document.createElement('span');
        this._flash.style.display = 'inline-block';
        this._flash.style.width = '20px';
        this._flash.style.height = '20px';
        this._flash.style.border = '1px solid black';
        this._el.appendChild(this._label);
        this._el.appendChild(this._flash);
        
        const emitter = this.getValue();
        emitter.event(this._onEvent, this);
    }
    _onEvent() {
        this._flash.style.transition = 'none';
        this._flash.style.backgroundColor = 'yellow';
        this._flash.getBoundingClientRect();
        if (this._timer) {
            this._timer.dispose();
        }
        this._timer = subscribeTimeout(() => {
            this._flash.style.transition = 'all linear .1s';
            this._flash.style.backgroundColor = 'white';
        }, 100);
    }
}