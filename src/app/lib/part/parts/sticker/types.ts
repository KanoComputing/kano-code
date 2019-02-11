import { registerTypeSerializer, defaultSerializer } from '../../component.js';

export class Sticker {
    private _value : string;
    constructor(value : string) {
        this._value = value;
    }
    set(v : string) {
        this._value = v;
    }
    get() {
        return this._value;
    }
};

registerTypeSerializer(Sticker, defaultSerializer);
