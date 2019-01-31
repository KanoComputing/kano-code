import AppModule from './app-module.js';

declare interface Constructor<T> {
    [K : string] : any;
    new(...args : any[]) : T;
}

class AppModules {
    public modules : { [K : string] : AppModule } = {};
    public state : 'running'|'stopped' = 'stopped';
    public static default : AppModules;
    public output : any;
    constructor(output? : any) {
        this.output = output;
    }
    define(id : string, ModuleClass : Constructor<AppModule>) {
        if (id in this.modules) {
            throw new Error(`Could not add module '${id}': Module was already added`);
        }
        this.modules[id] = new ModuleClass(this.output);
        if (ModuleClass.aliases) {
            ModuleClass.aliases.forEach((alias : string) => {
                this.modules[alias] = this.modules[id];
            });
        }
    }
    config(config : any) {
        Object.keys(this.modules).forEach((id) => {
            if (this.modules[id] && typeof this.modules[id].config === 'function') {
                this.modules[id].config(config);
            }
        });
    }
    /**
     * Support legacy API
     */
    init(arg : any) {
        this.config(arg);
    }
    getModule(id : string) : any {
        if (this.modules[id]) {
            return this.modules[id].methods;
        }
        return {};
    }
    createAppCode(prefix : string, code : string) {
        const moduleImports = Object.keys(this.modules).reduce((acc, id) => {
            const symbols = this.modules[id].getSymbols();
            acc += `var ${id} = ${prefix}.getModule('${id}');\n`;
            acc += symbols.map(s => `var ${s} = ${prefix}.getModule('${id}').${s};\n`).join('');
            return acc;
        }, '');
        return `(function () {\n${moduleImports}\n${code}\n})();\n`;
    }
    _runModuleLifecycleStep(name : string) {
        // Get a unique array as aliases add the modules in the map twice under different names
        const modulesArray = [...new Set(Object.values(this.modules))];
        modulesArray.forEach((mod) => {
            if (typeof mod.executeLifecycleStep === 'function') {
                mod.executeLifecycleStep(name);
            }
        });
    }
    start() {
        if (this.state === 'running') {
            return;
        }
        this._runModuleLifecycleStep('start');
        this.state = 'running';
    }
    stop() {
        if (this.state === 'running') {
            this._runModuleLifecycleStep('stop');
            this.state = 'stopped';
        }
    }
    afterRun() {
        this._runModuleLifecycleStep('afterRun');
    }
    addModule(id : string, m : AppModule) {
        this.modules[id] = m;
    }
    instrumentize(method : string) : any {
        const parts = method.split('.');
        const rootName = parts.shift();

        if (!rootName || !this.modules[rootName]) {
            throw new Error(`Could not instrumentize '${method}': No such method in '${rootName}'`);
        }
        return this.modules[rootName].instrumentize(method, parts.join('.'));
    }
    dispose() {
        this.stop();
        this.output = null;
    }
}

AppModules.default = new AppModules();

export default AppModules;
