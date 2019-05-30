import { EventEmitter } from '@kano/common/index.js';
import { collectPrototype } from './util.js';

/**
 * Defines the save/load logic for a value.
 */
export interface IComponentSerializer {
    /**
     * Transform a live object into a serializable value
     * @param data The initial values defined by the user
     */
    serialize(data : any) : any;
    /**
     * Returns a hydrated object from the given value
     * @param data A serialized value
     */
    load(data : any) : any;
}

/**
 * Property descriptor. Defines the type and default value for a property
 * This will be used to reset a property when the user's creation stop or when added for the first time
 */
export interface IComponentProperty<T> {
    type : T;
    value : T|(() => T);
    noReset? : boolean;
}

// Registry of all serializers. Used to store default and defined serializer
const serializers : Map<any, IComponentSerializer> = new Map();

/**
 * Defines a serializer for a data type. That data type will then be able to be save and loaded by the editor
 * @param type The data type targetted by this serializer. e.g. String, Number, Function, MyClass...
 * @param serializer A serializer able to svae and load that specific deata type
 */
export function registerTypeSerializer(type : any, serializer : IComponentSerializer) {
    if (typeof serializer.serialize !== 'function') {
        throw new Error(`Could not register serializer: 'serialize' is not a function`);
    }
    if (typeof serializer.load !== 'function') {
        throw new Error(`Could not register serializer: 'load' is not a function`);
    }
    serializers.set(type, serializer);
}

/**
 * A default serializer that handle native JSON types
 */
export const defaultSerializer : IComponentSerializer = {
    serialize(data) {
        return data;
    },
    load(serialized) {
        return serialized;
    },
};

/**
 * A null serializer that save nothing, and load nothing.
 * Can be used when a data type for a property must not be exported
 */
export const noopSerializer = {
    serialize() {
        return null;
    },
    load() {
        return null;
    },
};

// Define the deafult supported types
registerTypeSerializer(Boolean, defaultSerializer);
registerTypeSerializer(String, defaultSerializer);
registerTypeSerializer(Number, defaultSerializer);
registerTypeSerializer(EventEmitter, noopSerializer);

/**
 * Defines a set of properties working together. These properties will be reset when the user's creation stop.
 * This set of properties can be invalidated to notify the part or any piece of Editor UI that a render is required.
 */
export class PartComponent {
    // Has the data held by this component since last applied
    public invalidated : boolean = true;
    // Event emitter notifying when the component is invalidated
    private _onDidInvalidate : EventEmitter = new EventEmitter();
    // Registry for the properties
    private _properties : Map<string, IComponentProperty<any>> = new Map();
    [K : string] : any;
    constructor() {
        this._setupProperties();
    }
    /**
     * Fires when the component is invalidated. Indicates that the data held by properties has changed since it was last applied
     * @event
     */
    get onDidInvalidate() {
        return this._onDidInvalidate.event;
    }
    protected _setupProperties() {
        this._properties = collectPrototype<IComponentProperty<any>>('properties', this.constructor, PartComponent);
        this._properties.forEach((property, key) => {
            if (!property) {
                throw new Error(`Could not create component: '${key}' does not have a type`);
            }
            if (!serializers.has(property.type)) {
                throw new Error(`Could not create component: type for '${key}' does not have a registered serializer. Use 'registerTypeSerializer' to allow the property to be saved and loaded`);
            }
        });
        this.reset();
    }
    /**
     * Reset all properties to their default values
     */
    reset() {
        this._properties.forEach((property, key) => {
            if (property.noReset) {
                return;
            }
            if (typeof property.value === 'function') {
                this[key] = property.value();
            } else {
                this[key] = property.value;
            }
        });
        this.invalidate();
    }
    /**
     * Mark this component as invalidated
     */
    invalidate() {
        this.invalidated = true;
        this._onDidInvalidate.fire();
    }
    /**
     * Mark this component as not invalidated. Use after the component data was rendered
     */
    apply() {
        this.invalidated = false;
    }
    static get properties() {
        return {};
    }
    /**
     * Use the defined serializers for known data types to store all properties values into a serializable JSON object
     */
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
    /**
     * Re-hydrate properties from a stored state
     * @param data A JSON object containing values for each properties
     */
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
    render(ctx: CanvasRenderingContext2D, el : HTMLElement) {}
}