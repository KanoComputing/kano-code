import { PluginReceiver } from '../editor/plugin/receiver.js';
import { Runner } from '../editor/runner.js';
import { OutputModule } from './module.js';
import { DefaultOutputViewProvider } from './default.js';
import { Plugin, PluginLifecycleStep } from '../editor/plugin.js';
import { OutputViewProvider, IOutputProvider } from './index.js';
import { PartsManager } from '../parts/manager.js';
import { Part } from '../parts/part.js';
import { Microphone } from './microphone.js';
import { EventEmitter, IEvent } from '@kano/common/index.js';
import { AppModuleConstructor } from '../app-modules/app-modules.js';

export interface IOutputProfile {
    id : string;
    onInstall?(output : Output) : void;
    onInject() : void;
    modules? : AppModuleConstructor[];
    plugins? : Plugin[];
    parts? : (typeof Part)[];
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
    microphone : Microphone;
}

export interface IDOMContext {
    root : HTMLElement;
    onDidResize : IEvent<void>;
}

export type IConfigResolver = <T>(key : string) => T|null;

let configResolver : IConfigResolver|null = null;

export const OutputConfig = {
    get<T>(key : string, fallback : T) : T {
        if (!configResolver) {
            return fallback;
        }
        const value = configResolver<T>(key);
        if (!value) {
            return fallback;
        }
        return value;
    }
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
    // Events
    private _onDidRunningStateChange : EventEmitter<boolean> = new EventEmitter<boolean>();
    get onDidRunningStateChange() { return this._onDidRunningStateChange.event }

    private _onDidFullscreenChange : EventEmitter<boolean> = new EventEmitter<boolean>();
    get onDidFullscreenChange() { return this._onDidFullscreenChange.event }

    static get config() {
        return OutputConfig;
    }

    /**
     * Set the global configuration resolver
     * @param resolver A configuration resolver
     */
    static setConfigResolver(resolver : IConfigResolver) {
        configResolver = resolver;
    }

    constructor() {
        super();
        this.runner = new Runner();
        this.runner.addModule(OutputModule);
        this.parts = new PartsManager(this);
        this.addPlugin(this.runner);
    }
    public runPluginTask(taskName : PluginLifecycleStep, ...args : any[]) {
        super.runPluginTask(taskName, ...args);
    }
    addPart(partClass : typeof Part) {
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
    registerProfile(outputProfile? : IOutputProfile) {
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
            this.outputProfile.modules.forEach((m : AppModuleConstructor) => this.runner.addModule(m));
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
        this._onDidRunningStateChange.fire(this._running);
    }
    getRunningState() {
        return this._running;
    }
    toggleRunningState() {
        this.setRunningState(!this.getRunningState());
    }
    setFullscreen(state : boolean) {
        this._fullscreen = state;
        this._onDidFullscreenChange.fire(this._fullscreen);
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
    setCode(code? : string) {
        this._code = code || '';
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
        if (this.outputProfile) {
            this.outputProfile.onInject();
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
