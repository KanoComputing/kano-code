import Output from '../output/output.js';
import { Instrument } from './instrument.js';

interface IMethodTree {
    [K : string] : Function|string|IMethodTree|any;
}

class SubModule {
    private root : IMethodTree;
    constructor(root : any) {
        this.root = root;
    }
    addMethod(name : string, cbName : string|Function) {
        this.root[name] = cbName;
    }
    addModule(name : string) {
        const root = {};
        this.root[name] = root;
        const subModule = new SubModule(root);
        return subModule;
    }
}

export abstract class AppModule {
    [K : string] : any;
    private rootModule : SubModule;
    public methods : IMethodTree;
    private lifecycle : { [K : string] : Function };
    private symbols : string[];
    protected output : Output;
    public static get id() : string {
        throw new Error('No id defined');
    }
    public static transformLegacy(app : any) {}
    constructor(output : Output) {
        this.output = output;
        this.lifecycle = {};
        this.methods = {};
        this.symbols = [];
        this.rootModule = new SubModule(this.methods);
    }
    getSymbols() {
        return this.symbols;
    }
    addMethod(name : string, cbName : Function|string) {
        if (typeof cbName === 'function') {
            this.rootModule.addMethod(name, cbName);
        } else if (typeof this[cbName] === 'function') {
            this.rootModule.addMethod(name, this[cbName].bind(this));
        } else {
            this.rootModule.addMethod(name, this[cbName]);
        }
    }
    addModule(name : string) {
        return this.rootModule.addModule(name);
    }
    instrumentize(fullPath : string, method : string) {
        const instrument = new Instrument(fullPath, this.methods, method);
        return instrument;
    }
    addLifecycleStep(name : string, cbName : string) {
        this.lifecycle[name] = this[cbName].bind(this);
    }
    executeLifecycleStep(name : string) {
        if (name === 'start') {
            this.isRunning = true;
        } else if (name === 'stop') {
            this.isRunning = false;
        }
        if (typeof this.lifecycle[name] === 'function') {
            this.lifecycle[name].call(this);
        }
    }
}

export default AppModule;
