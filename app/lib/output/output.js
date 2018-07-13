import { PluginReceiver } from '../editor/plugin/receiver.js';
import { Runner } from '../editor/runner.js';
import { OutputModule } from './module.js';
import { DefaultOutputViewProvider } from './default.js';

export class Output extends PluginReceiver {
    constructor() {
        super();
        this.runner = new Runner();
        this.runner.addModule(OutputModule);
        this.addPlugin(this.runner);
        this._running = false;
    }
    addPlugin(plugin) {
        super.addPlugin(plugin);
        plugin.onInstall(this);
    }
    registerOutputViewProvider(provider) {
        this.outputViewProvider = provider;
        this.outputViewProvider.onInstall(this);
    }
    registerProfile(outputProfile) {
        // No outputProfile was provider, fallback to default
        if (!outputProfile) {
            return;
        }
        if (!outputProfile.id) {
            throw new Error('Could not register OutputProfile: missing id');
        }
        if (outputProfile && !Array.isArray(outputProfile.modules)) {
            throw new Error('Could not register OutputProfile: modules is not an array');
        }
        if (outputProfile.plugins && !Array.isArray(outputProfile.plugins)) {
            throw new Error('Could not register OutputProfile: plugins is not an array');
        }
        this.outputProfile = outputProfile;
        // Missing outputViewProvider, using default one
        if (!this.outputProfile.outputViewProvider) {
            this.registerOutputViewProvider(new DefaultOutputViewProvider(this));
        } else {
            this.registerOutputViewProvider(this.outputProfile.outputViewProvider);
        }
        // Add defined plugins
        if (this.outputProfile.plugins) {
            this.outputProfile.plugins.forEach(p => this.addPlugin(p));
        }
        // Add defined modules to the runner
        if (this.outputProfile.modules) {
            this.outputProfile.modules.forEach(m => this.runner.addModule(m));
        }
    }
    setRunningState(running) {
        this._running = running;
        this.emit('running-state-changed');
    }
    getRunningState() {
        return this._running;
    }
    toggleRunningState() {
        this.setRunningState(!this.getRunningState());
    }
    restart() {
        this.setRunningState(false);
        this.setRunningState(true);
    }
    setCode(code) {
        this._code = code;
    }
    getCode() {
        return this._code;
    }
    get id() {
        return this.outputProfile.id;
    }
    get outputView() {
        return this.outputViewProvider;
    }
    onInject() {
        if (this.outputViewProvider) {
            this.outputViewProvider.onInject();
        }
    }
    onExport(data) {
        return this.plugins.reduce((d, plugin) => {
            return plugin.onExport(d);
        }, data);
    }
    onImport(data) {
        this.runPluginTask('onImport', data);
    }
    onCreationExport(data) {
        data.code = this.getCode();
        data.profile = this.outputProfile.id;
        return data;
    }
    onCreationImport(data) {
        return this.runPluginChainTask('onCreationImport', data)
            .then(() => {
                const res = this.outputView.onCreationImport(data);
                if (res instanceof Promise) {
                    return res.then(() => {
                        this.setCode(data.code);
                        this.setRunningState(true);
                    });
                }
                this.setCode(data.code);
                this.setRunningState(true);
                return null;
            });
    }
    getMode() {
        return this._mode;
    }
    setMode(mode) {
        this._mode = mode;
    }
}

export default Output;
