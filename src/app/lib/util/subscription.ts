import { Disposables } from '@kano/common/index.js';

interface ISubscribable {
    on(name : string|number|Symbol, cb : Function) : void;
    removeListener(name : string|number|Symbol, cb : Function) : void;
}

function targetIsHTMLElement(target : HTMLElement|ISubscribable) : target is HTMLElement {
    return target instanceof HTMLElement;
}

export const subscribe = (target : HTMLElement|ISubscribable, name : string|number|Symbol, callback : (arg : any) => void) => {
    if (targetIsHTMLElement(target)) {
        target.addEventListener(name as string, callback);
    } else {
        target.on(name, callback);
    }
    const dispose = () => {
        if (targetIsHTMLElement(target)) {
            target.removeEventListener(name as string, callback);
        } else {
            target.removeListener(name, callback);
        }
    };
    return { dispose };
};

export class Subscriptions extends Disposables {
    static subscribe(target : HTMLElement|ISubscribable, name : string|number|Symbol, callback : (arg : any) => void) {
        return subscribe(target, name, callback);
    }
}

export default subscribe;
