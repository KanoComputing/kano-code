import VM from '../vm.js';
import AppModulesLoader from '../app-modules/index.js';
import { Plugin } from './plugin.js';

export class Runner extends Plugin {
    constructor() {
        super();
        this.modules = [];
        this._onRunningStateChange = this._onRunningStateChange.bind(this);
    }
    addModule(mod) {
        const mods = Array.isArray(mod) ? mod : [mod];
        mods.forEach(m => this.modules.push(m));
        this._updateModules();
    }
    onInstall(output) {
        this.output = output;
        this._updateModules();
        this.output.on('running-state-changed', this._onRunningStateChange);
    }
    onImport() {
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
        const running = this.output.getRunningState();
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
        const vm = new VM({ AppModules: appModules });
        // Run the code
        vm.runInContext(appCode);
        appModules.afterRun();
    }
}

export default Runner;
