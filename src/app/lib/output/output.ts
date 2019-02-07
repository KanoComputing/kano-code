import { PluginReceiver } from '../editor/plugin/receiver.js';
import { Runner } from '../editor/runner.js';
import { OutputModule } from './module.js';
import { DefaultOutputViewProvider } from './default.js';
import { Plugin } from '../editor/plugin.js';
import { AppModule } from '../app-modules/app-module.js';
import { OutputViewProvider, IOutputProvider } from './index.js';
import { PartsManager, PartContructor } from '../part/manager.js';
import { Part } from '../part/part.js';

export interface IOutputProfile {
    id : string;
    onInstall?(output : Output) : void;
    modules? : Type<AppModule>[];
    plugins? : Plugin[];
    parts? : PartContructor[];
    outputViewProvider? : OutputViewProvider;
}

export interface IVisualsContext {
    canvas : HTMLCanvasElement;
    width : number;
    height : number;
}

export interface IAudioContext {
    context : AudioContext;
    destination : AudioDestinationNode;
}

export interface IDOMContext {
    root : HTMLElement;
}

export class Output extends PluginReceiver {
    public runner : Runner;
    private _running : boolean = false;
    private _fullscreen : boolean = false;
    private _code : string = '';
    public parts : PartsManager;
    public outputViewProvider? : IOutputProvider;
    public outputProfile? : IOutputProfile;
    public get visuals() : IVisualsContext {
        if (!this.outputViewProvider) {
            throw new Error('Could not get visuals: Output view was not registered');
        }
        return this.outputViewProvider.getVisuals();
    }
    public get audio() : IAudioContext {
        if (!this.outputViewProvider) {
            throw new Error('Could not get audio: Output view was not registered');
        }
        return this.outputViewProvider.getAudio();
    }
    public get dom() : IDOMContext {
        if (!this.outputViewProvider) {
            throw new Error('Could not get DOM: Output view was not registered');
        }
        return this.outputViewProvider.getDOM();
    }
    constructor() {
        super();
        this.runner = new Runner();
        this.runner.addModule(OutputModule);
        this.parts = new PartsManager(this);
        this.addPlugin(this.runner);
    }
    addPart(partClass : Type<Part>) {
        this.parts.addPart(partClass);
    }
    addPlugin(plugin : Plugin) {
        super.addPlugin(plugin);
        plugin.onInstall(this);
    }
    registerOutputViewProvider(provider : OutputViewProvider) {
        this.outputViewProvider = provider;
        this.outputViewProvider.onInstall(this);
    }
    registerProfile(outputProfile : IOutputProfile) {
        // No outputProfile was provider, fallback to default
        if (!outputProfile) {
            return;
        }
        if (outputProfile.onInstall) {
            outputProfile.onInstall(this);
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
            this.registerOutputViewProvider(new DefaultOutputViewProvider());
        } else {
            this.registerOutputViewProvider(this.outputProfile.outputViewProvider);
        }
        // Add defined plugins
        if (this.outputProfile.plugins) {
            this.outputProfile.plugins.forEach((p : Plugin) => this.addPlugin(p));
        }
        // Add defined modules to the runner
        if (this.outputProfile.modules) {
            this.outputProfile.modules.forEach((m : Type<AppModule>) => this.runner.addModule(m));
        }
        if (this.outputProfile.parts) {
            this.outputProfile.parts.forEach(p => this.parts.registerPart(p));
        }
    }
    ensureOutputView() {
        if (!this.outputViewProvider) {
            this.outputViewProvider = new DefaultOutputViewProvider();
        }
    }
    setRunningState(running : boolean) {
        this._running = running;
        this.emit('running-state-changed');
    }
    getRunningState() {
        return this._running;
    }
    toggleRunningState() {
        this.setRunningState(!this.getRunningState());
    }
    setFullscreen(state : boolean) {
        this._fullscreen = state;
        this.emit('fullscreen-changed');
    }
    getFullscreen() {
        return this._fullscreen;
    }
    toggleFullscreen() {
        this.setFullscreen(!this.getFullscreen());
    }
    restart() {
        this.setRunningState(false);
        this.setRunningState(true);
    }
    setCode(code : string) {
        this._code = code;
    }
    getCode() {
        return this._code;
    }
    get id() {
        if (!this.outputProfile) {
            throw new Error('Could not get profile id: An output pforile was not registered');
        }
        return this.outputProfile.id;
    }
    get outputView() {
        return this.outputViewProvider;
    }
    onInject() {
        this.ensureOutputView();
        if (this.outputViewProvider) {
            this.outputViewProvider.onInject();
        }
        this.parts.onInject();
        this.runPluginTask('onInject');
    }
    onExport(data : any) {
        const parts = this.parts.save();
        const exp = this.plugins.reduce((d, plugin) => plugin.onExport(d), data);
        exp.parts = parts;
        return exp;
    }
    onImport(data : any) {
        this.parts.load(data.parts || []);
        this.runPluginTask('onImport', data);
    }
    onCreationExport(data : any) {
        data.code = this.getCode();
        data.profile = this.id;
        data.parts = this.parts.save();
        return data;
    }
    onCreationImport(data : any) {
        return this.runPluginChainTask('onCreationImport', data)
            .then(() => {
                if (this.outputView) {
                    return this.outputView.onCreationImport(data);
                }
            })
            .then(() => {
                this.parts.load(data.parts || []);
                this.setCode(data.code);
            });
    }
    render(...args : any[]) {
        if (this.outputViewProvider) {
            return this.outputViewProvider.render(...args);
        }
        return null;
    }
    dispose() {
        this.runner.dispose();
        if (this.outputViewProvider) {
            this.outputViewProvider.onDispose();
        }
        this.runPluginTask('onDispose');
    }
}

export default Output;
