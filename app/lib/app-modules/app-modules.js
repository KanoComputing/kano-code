
class AppModules {
    constructor(output) {
        this.output = output;
        this.modules = {};
    }
    define(name, ModuleClass) {
        this.modules[name] = new ModuleClass(this.output);
        if (ModuleClass.aliases) {
            ModuleClass.aliases.forEach((alias) => {
                this.modules[alias] = this.modules[name];
            });
        }
    }
    config(config) {
        Object.keys(this.modules).forEach((name) => {
            if (this.modules[name] && this.modules[name].config && typeof this.modules[name].config === 'function') {
                this.modules[name].config(config);
            }
        });
    }
    /**
     * Support legacy API
     */
    init(...args) {
        this.config(...args);
    }
    getModule(name) {
        if (this.modules[name]) {
            return this.modules[name].methods;
        }
        return {};
    }
    createAppCode(prefix, code) {
        const moduleImports = Object.keys(this.modules).reduce((acc, name) => {
            const symbols = this.modules[name].getSymbols();
            acc += `var ${name} = ${prefix}.getModule('${name}');\n`;
            acc += symbols.map(s => `var ${s} = ${prefix}.getModule('${name}').${s};\n`).join('');
            return acc;
        }, '');
        return `(function () {\n${moduleImports}\n${code}\n})();\n`;
    }
    _runModuleLifecycleStep(name) {
        Object.keys(this.modules).forEach((key) => {
            if (typeof this.modules[key].executeLifecycleStep === 'function') {
                this.modules[key].executeLifecycleStep(name);
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
    addModule(id, m) {
        this.modules[id] = m;
    }
    instrumentize(method) {
        const parts = method.split('.');
        const rootName = parts.shift();

        if (!this.modules[rootName]) {
            throw new Error(`Could not instrumentize '${method}': No such method in '${rootName}'`);
        }
        return this.modules[rootName].instrumentize(method, parts.join('.'));
    }
}

AppModules.default = new AppModules();

export default AppModules;
