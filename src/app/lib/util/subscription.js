import { Disposables } from '@kano/common/index.js';

export const subscribe = (target, name, callback) => {
    const isDom = target instanceof HTMLElement;
    if (isDom) {
        target.addEventListener(name, callback);
    } else {
        target.on(name, callback);
    }
    const dispose = () => {
        if (isDom) {
            target.removeEventListener(name, callback);
        } else {
            target.removeListener(name, callback);
        }
    };
    return { dispose };
};

export class Subscriptions extends Disposables {
    static subscribe(...args) {
        return subscribe(...args);
    }
}

export default subscribe;
