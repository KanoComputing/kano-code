import EventEmitter from '../util/event-emitter.js';

class SubModule {
    constructor(root) {
        this.root = root;
    }
    addMethod(name, cbName) {
        this.root[name] = cbName;
    }
    addModule(name) {
        const root = {};
        this.root[name] = root;
        const subModule = new SubModule(root);
        return subModule;
    }
}

class Instrument extends EventEmitter {
    constructor(fullPath, root, method) {
        super();
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
            if (typeof root[name] === 'function') {
                this.methodParent = root;
                this.methodName = name;
                this.originalFunc = root[name];
                root[name] = this.callMethod(this.originalFunc);
                return;
            }
            if (typeof root[name] !== 'object') {
                throw new Error(`Could not intrumentize '${this.method}': path does not point to a function`);
            }
            root = root[name];
        }
        throw new Error(`Could not intrumentize '${this.method}'`);
    }
    callMethod(originalFunc) {
        return (...args) => {
            this.emit('method-called', { method: this.fullPath, args });
            originalFunc(...args);
        };
    }
    dispose() {
        if (!this.methodParent) {
            return;
        }
        this.methodParent[this.methodName] = this.originalFunc;
    }
}

export class AppModule {
    constructor(output) {
        this.output = output;
        this.lifecycle = {};
        this.methods = {};
        this.symbols = [];
        this.rootModule = new SubModule(this.methods);
    }
    getSymbols() {
        return this.symbols;
    }
    config() {}
    addMethod(name, cbName) {
        if (typeof cbName === 'function') {
            this.rootModule.addMethod(name, cbName);
        } else if (typeof this[cbName] === 'function') {
            this.rootModule.addMethod(name, this[cbName].bind(this));
        } else {
            this.rootModule.addMethod(name, this[cbName]);
        }
    }
    addModule(name) {
        return this.rootModule.addModule(name);
    }
    instrumentize(fullPath, method) {
        const instrument = new Instrument(fullPath, this.methods, method);
        return instrument;
    }
    addLifecycleStep(name, cbName) {
        this.lifecycle[name] = this[cbName].bind(this);
    }
    executeLifecycleStep(name) {
        if (name === 'start') {
            this.isRunning = true;
        } else if (name === 'stop') {
            this.isRunning = false;
        }
        if (typeof this.lifecycle[name] === 'function') {
            this.lifecycle[name].call(this);
        }
    }
    throttle(id, cb, delay) {
        // Push the logic to next event loop iteration.
        // This let the blocking calls to the same id stack up
        setTimeout(() => {
            AppModule.nextCall = AppModule.nextCall || {};
            AppModule.waiting = AppModule.waiting || {};
            // Last call buffer time passed, call the method and create a buffer time
            if (!AppModule.nextCall[id]) {
                // When the time has passed, check if a call was made and if so,
                // execute the callback
                AppModule.nextCall[id] = setTimeout(() => {
                    AppModule.nextCall[id] = null;
                    if (AppModule.waiting[id]) {
                        this.throttle(id, AppModule.waiting[id], delay);
                        AppModule.waiting[id] = null;
                    }
                }, delay);
                // Execute the callback
                cb();
            } else {
                // The last call was less than `delay` ms ago, just update the waiting call
                AppModule.waiting[id] = cb; 
            }
        });
    }
}

export default AppModule;
