import { Part } from './part.js';
import { PartComponent } from './component.js';

/**
 * Automatically registers the type and name for a given part
 * Example:
 * ```ts
 * @part('my-part')
 * class MyPart extends Part{}
 * ```
 * @param type Type of the part
 * @param name Label for the part
 */
export function part(type : string) {
    return function (constructor : Type<Part>) {
        Object.defineProperty(constructor, 'type', {
            writable: false,
            configurable: false,
            value: type,
            enumerable: false,
        });
    };
}

const componentsCache : Map<any, { [K : string] : typeof PartComponent }> = new Map();

/**
 * Automatically register the component and bind them to the Part property
 * Example:
 * ```ts
 * class MyPart extends Part {
 *     @component(Transform)
 *     public transform : Transform;
 * }
 * ```
 * @param comp Component class for a given property
 */
export function component(comp : typeof PartComponent) {
    return function (this : any, target : any, key : string) {
        if (!componentsCache.has(target)) {
            componentsCache.set(target, {});
        }
        const cachedProps = componentsCache.get(target);
        if (cachedProps) {
            cachedProps[key] = comp;
        }
        if (!target.constructor.hasOwnProperty('components')) {
            Object.defineProperty(target.constructor, 'components', {
                get: () => componentsCache.get(target),
                enumerable: true,
            });
        }
    }
}

const propertiesCache : Map<any, { [K : string] : { type : any, value: any } }> = new Map();

interface IPropertiesOptions {
    type : any;
    value : any;
    noReset? : boolean;
}

/**
 * Automatically register the component and bind them to the Part property
 * Example:
 * ```ts
 * class MyComponent extends Component {
 *     @property(Number)
 *     public x : number;
 * }
 * ```
 * @param comp Component class for a given property
 */
export function property(propOptions : IPropertiesOptions) {
    return function (this : any, target : any, key : string) {
        if (!propertiesCache.has(target)) {
            propertiesCache.set(target, {});
        }
        const cachedProps = propertiesCache.get(target);
        if (cachedProps) {
            cachedProps[key] = propOptions;
        }
        if (!target.constructor.hasOwnProperty('properties')) {
            Object.defineProperty(target.constructor, 'properties', {
                get: () => propertiesCache.get(target),
                enumerable: true,
            });
        }
    }
}