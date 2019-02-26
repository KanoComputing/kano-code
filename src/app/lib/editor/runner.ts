import VM from '../vm.js';
import AppModulesLoader from '../app-modules/index.js';
import { Plugin } from './plugin.js';
import AppModule from '../app-modules/app-module.js';
import { VariableStore } from './variables.js';
import Output from '../output/output.js';

export class Runner extends Plugin {
    private modules : Type<AppModule>[] = [];
    private output? : Output;
    private appModulesLoader : AppModulesLoader|null = null;
    private vm : VM|null = null;
    public variables : VariableStore = new VariableStore();
    constructor() {
        super();
        this._onRunningStateChange = this._onRunningStateChange.bind(this);
    }
    getModule(id : string) {
        return this.appModulesLoader!.appModules.modules[id];
    }
    getRegisteredModules() {
        return Object.values(this.appModulesLoader!.appModules.modules);
    }
    addModule(mod : Type<AppModule>) {
        const mods = Array.isArray(mod) ? mod : [mod];
        mods.forEach(m => this.modules.push(m));
        this._updateModules();
    }
    onInstall(output : Output) {
        this.output = output;
        this._updateModules();
        this.output.onDidRunningStateChange(() => this._onRunningStateChange());
    }
    onImport() {
        if (!this.output) {
            return;
        }
        // Force refresh app state if was running
        const running = this.output.getRunningState();
        if (running) {
            this.output.setRunningState(!running);
            this.output.setRunningState(running);
        }
    }
    _updateModules() {
        if (!this.output) {
            return;
        }
        if (this.appModulesLoader) {
            const { appModules } = this.appModulesLoader;
            appModules.stop();
        }
        this.appModulesLoader = new AppModulesLoader(this.output, this.modules);
        this.appModulesLoader.start();
    }
    _onRunningStateChange() {
        if (!this.output) {
            return;
        }
        const running = this.output.getRunningState();
        if (!this.appModulesLoader) {
            return;
        }
        const { appModules } = this.appModulesLoader;
        if (!running) {
            appModules.stop();
            return;
        }
        const code = this.output.getCode();
        // Generate the code
        const appCode = appModules.createAppCode('AppModules', code);
        // Start all the modules. Will also trigger the `start` event from `global`
        appModules.start();
        // Prepare a sandbox exposing AppModules
        this.vm = new VM({ AppModules: appModules });
        // Prevent invalid code to crach synchronous tasks
        try {
            // Run the code
            this.vm.runInContext(appCode);
        } catch(e) {
            console.error(e);
        }
        appModules.afterRun();
    }
    instrumentize(method : string) {
        if (!this.appModulesLoader) {
            return;
        }
        const { appModules } = this.appModulesLoader;
        return appModules.instrumentize(method);
    }
    dispose() {
        if (this.appModulesLoader) {
            this.appModulesLoader.dispose();
        }
        if (this.vm) {
            this.vm.dispose();
            this.vm = null;
        }
        this.modules.length = 0;
        this.appModulesLoader = null;
    }
}

export default Runner;
