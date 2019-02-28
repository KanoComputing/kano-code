import { AppModules, AppModuleConstructor } from './app-modules.js';

class AppModulesLoader {
    private output : any;
    public appModules : AppModules;
    private modules : AppModuleConstructor[];
    constructor(output : any, modules : AppModuleConstructor[]) {
        this.output = output;
        this.appModules = new AppModules(output);
        this.modules = modules;
    }
    start() {
        this.appModules.init(this.output.config);
        this.modules.forEach((Mod) => {
            if (Mod.id) {
                this.appModules.define(Mod.id, Mod);
            }
        });
    }
    dispose() {
        this.appModules.dispose();
    }
}

export default AppModulesLoader;
