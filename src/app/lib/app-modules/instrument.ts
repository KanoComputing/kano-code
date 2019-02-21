import { EventEmitter } from '@kano/common/index.js';

export interface ICallDescription {
    method : string;
    args : any[];
}

export class Instrument {
    private fullPath : string;
    private root : any;
    private method : string;
    private methodParent? : any;
    private methodName? : string;
    private originalFunc? : Function;
    private _onDidMethodCall : EventEmitter<ICallDescription> = new EventEmitter();
    get onDidMethodCall() { return this._onDidMethodCall.event; }
    constructor(fullPath : string, root : any, method : string) {
        this.fullPath = fullPath;
        this.root = root;
        this.method = method;
        this.setup();
    }
    setup() {
        const parts = this.method.split('.');
        let { root } = this;
        let name;
        while (parts.length) {
            name = parts.shift();
            if (name && typeof root[name] === 'function') {
                this.methodParent = root;
                this.methodName = name;
                this.originalFunc = root[name];
                root[name] = this.callMethod(this.originalFunc);
                return;
            }
            if (name && typeof root[name] !== 'object') {
                throw new Error(`Could not intrumentize '${this.method}': path does not point to a function`);
            }
            root = name ? root[name] : root;
        }
        throw new Error(`Could not intrumentize '${this.method}'`);
    }
    callMethod(originalFunc? : Function) {
        return (...args : any[]) => {
            this._onDidMethodCall.fire({ method: this.fullPath, args });
            if (originalFunc) {
                return originalFunc(...args);
            }
        };
    }
    dispose() {
        if (!this.methodParent || !this.methodName) {
            return;
        }
        this.methodParent[this.methodName] = this.originalFunc;
    }
}