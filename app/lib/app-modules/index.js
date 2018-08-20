import AppModules from './app-modules.js';

class AppModulesLoader {
    constructor(output, modules) {
        this.output = output;
        this.appModules = new AppModules(output);
        this.modules = modules;
    }
    start() {
        this.appModules.init(this.output.config);
        this.modules.forEach((Mod) => {
            this.appModules.define(Mod.name, Mod);
        });
    }
}

export default AppModulesLoader;
