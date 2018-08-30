
class AppModules {
    constructor(output) {
        this.output = output;
        this.modules = {};
    }
    define(id, ModuleClass) {
        this.modules[id] = new ModuleClass(this.output);
        if (ModuleClass.aliases) {
            ModuleClass.aliases.forEach((alias) => {
                this.modules[alias] = this.modules[id];
            });
        }
    }
    config(config) {
        Object.keys(this.modules).forEach((id) => {
            if (this.modules[id] && this.modules[id].config && typeof this.modules[id].config === 'function') {
                this.modules[id].config(config);
            }
        });
    }
    /**
     * Support legacy API
     */
    init(...args) {
        this.config(...args);
    }
    getModule(id) {
        if (this.modules[id]) {
            return this.modules[id].methods;
        }
        return {};
    }
    createAppCode(prefix, code) {
        const moduleImports = Object.keys(this.modules).reduce((acc, id) => {
            const symbols = this.modules[id].getSymbols();
            acc += `var ${id} = ${prefix}.getModule('${id}');\n`;
            acc += symbols.map(s => `var ${s} = ${prefix}.getModule('${id}').${s};\n`).join('');
            return acc;
        }, '');
        return `(function () {\n${moduleImports}\n${code}\n})();\n`;
    }
    _runModuleLifecycleStep(name) {
        Object.keys(this.modules).forEach((id) => {
            if (typeof this.modules[id].executeLifecycleStep === 'function') {
                this.modules[id].executeLifecycleStep(name);
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
