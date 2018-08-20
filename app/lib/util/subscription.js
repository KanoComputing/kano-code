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

export class Subscriptions {
    constructor() {
        this.subs = [];
    }
    push(...args) {
        args.forEach(arg => this.subs.push(arg));
    }
    dispose() {
        this.subs.forEach(sub => sub.dispose());
    }
    static subscribe(...args) {
        return subscribe(...args);
    }
}

export default subscribe;
