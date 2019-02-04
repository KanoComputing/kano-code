import { EventEmitter } from '@kano/common/index.js';
import { collectPrototype } from './util.js';

export interface IComponentSerializer {
    serialize(data : any) : any;
    load(data : any) : any;
}

export interface IComponentProperty<T> {
    type : T;
    value : T|(() => T);
}

export interface IComponentProperties {
    [K : string] : IComponentProperty<any>;
}

const serializers : Map<any, IComponentSerializer> = new Map();

export function registerTypeSerializer(type : any, serializer : IComponentSerializer) {
    if (typeof serializer.serialize !== 'function') {
        throw new Error(`Could not register serializer: 'serialize' is not a function`);
    }
    if (typeof serializer.load !== 'function') {
        throw new Error(`Could not register serializer: 'load' is not a function`);
    }
    serializers.set(type, serializer);
}

export const defaultSerializer : IComponentSerializer = {
    serialize(data) {
        return data;
    },
    load(serialized) {
        return serialized;
    },
};
export const noopSerializer = {
    serialize() {
        return null;
    },
    load() {
        return null;
    },
};

registerTypeSerializer(Boolean, defaultSerializer);
registerTypeSerializer(String, defaultSerializer);
registerTypeSerializer(Number, defaultSerializer);
registerTypeSerializer(EventEmitter, noopSerializer);

export class PartComponent {
    public invalidated : boolean = true;
    private _onDidInvalidate : EventEmitter = new EventEmitter();
    private _properties : Map<string, IComponentProperty<any>> = new Map();
    [K : string] : any;
    constructor() {
        this._setupProperties();
    }
    get onDidInvalidate() {
        return this._onDidInvalidate.event;
    }
    _setupProperties() {
        this._properties = collectPrototype<IComponentProperty<any>>('properties', this.constructor, PartComponent);
        this._properties.forEach((property, key) => {
            if (!property) {
                throw new Error(`Could not create component: '${key}' does not have a type`);
            }
            if (!serializers.has(property.type)) {
                throw new Error(`Could not create component: type for '${key}' does not have a registered serializer. Use 'registerTypeSerializer' to allow the property to be saved and loaded`);
            }
            if (typeof property.value === 'function') {
                this[key] = property.value();
            } else {
                this[key] = property.value;
            }
        });
    }
    invalidate() {
        this.invalidated = true;
        this._onDidInvalidate.fire();
    }
    apply() {
        this.invalidated = false;
    }
    static get properties() {
        return {};
    }
    serialize() {
        const collector : { [K : string] : any } = {};
        this._properties.forEach((property, key) => {
            const serializer = serializers.get(property.type);
            if (!serializer) {
                return;
            }
            const serialized = serializer.serialize(this[key]);
            if (serialized !== null && typeof serialized !== 'undefined') {
                collector[key] = serialized;
            }
        });
        return collector;
    }
    load(data : any) {
        this._properties.forEach((property, key) => {
            const serializer = serializers.get(property.type);
            if (!serializer) {
                return;
            }
            const loaded = serializer.load(data[key]);
            if (loaded !== null && typeof loaded !== 'undefined') {
                this[key] = loaded;
            }
            // Strict loading? Throw error when missing data maybe
        });
        this.invalidate();
    }
}