import { throttle as th } from './util/throttle.js';
import { debounce as deb } from './util/debounce.js';

const COLORS: { [K: string]: string } = {
    TRACE: 'grey',
    DEBUG: 'cyan',
}

function logMethod(name: string, key: string, args: any[], level: string) {
    const color = COLORS[level];
    console.log(`[%c${level}%c] %c${name}%c.%c${key}%c(`, `color: ${color}`, 'color: inherit', 'color: #03a9f4', 'color: white', 'color: #03a9f4', 'color: inherit', ...args, ')');
}

function logDecoratorFactory(level: string) {
    return function log(target: any, key: string, descriptor: any) {
        if (!descriptor) {
            return;
        }
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            logMethod(target.constructor.name, key, args, level);
            return originalMethod.apply(this, arguments);
        };
        return descriptor;
    }
}

export const trace = logDecoratorFactory('TRACE');
export const debug = logDecoratorFactory('DEBUG');

export function deprecated(message: string) {
    return (target: any, key: string, descriptor: any) => {
        if (!descriptor) {
            return;
        }
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            console.warn(`${key} is deprecated`, message);
            return originalMethod.apply(this, arguments);
        };
        return descriptor;
    }
}

export function throttle(delay: number, immediate: boolean = false) {
    return (target: any, key: string, descriptor: any) => {
        if (!descriptor) {
            return;
        }
        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            get: function getter(this: any) {
                // Attach this function to the instance (not the class)
                Object.defineProperty(this, key, {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    value: th(descriptor.value, delay, immediate),
                });
                return this[key];
            },
        };
    }
}


export function debounce(delay: number) {
    return (target : any, key : string, descriptor : any) => {
        if (!descriptor) {
            return;
        }
        return {
            configurable: true,
            enumerable: descriptor.enumerable,
            get: function getter(this : any) {
                // Attach this function to the instance (not the class)
                Object.defineProperty(this, key, {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    value: deb(descriptor.value, delay),
                });
                return this[key];
            },
        };
    }
}
