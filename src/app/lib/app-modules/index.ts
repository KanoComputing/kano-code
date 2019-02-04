import AppModules from './app-modules.js';
import AppModule from './app-module.js';

type IAppModuleType = Type<AppModule> & {
    id? : string;
}

class AppModulesLoader {
    private output : any;
    public appModules : AppModules;
    private modules : IAppModuleType[];
    constructor(output : any, modules : IAppModuleType[]) {
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
