import { Part } from './part.js';
import { PartComponent } from './component.js';

/**
 * Automatically registers the type and name for a given part
 * Example:
 * ```ts
 * @part('my-part', 'My Part')
 * class MyPart extends Part{}
 * ```
 * @param type Type of the part
 * @param name Label for the part
 */
export function part(type : string, name : string) {
    return function (contructor : Type<Part>) {
        Object.defineProperty(contructor, 'type', {
            writable: false,
            configurable: false,
            value: type,
            enumerable: false,
        });
        // We use partname as name would class with the class name on safari
        Object.defineProperty(contructor, 'partName', {
            writable: false,
            configurable: false,
            value: name,
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
