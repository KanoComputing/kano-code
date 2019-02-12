import { Output, IVisualsContext, IAudioContext, IDOMContext } from './output.js';

export interface IOutputProvider {
    root : HTMLElement;
    start() : void;
    stop() : void;
    onInstall(output : any) :void;
    onInject() : void;
    onImport() : void;
    onExport(data : any) : any;
    onCreationImport(data : any) : Promise<any>|any;
    onCreationExport(data : any) : any;
    render(...args : any[]) : any;
    getRestrictElement() : HTMLElement;
    onDispose() : void;
    getVisuals() : IVisualsContext;
    getAudio() : IAudioContext;
    getDOM() : IDOMContext;
    resize() : void;
}

export abstract class OutputViewProvider implements IOutputProvider {
    public root : HTMLElement = document.createElement('div');
    start() {}
    stop() {}
    onInstall(output : Output) {}
    onInject() {}
    onImport() {}
    onExport(data : any) {
        return data;
    }
    onCreationImport(data : any) : Promise<any>|any {}
    onCreationExport(data : any) {
        return data;
    }
    render(...args : any[]) : any {}
    getRestrictElement() {
        return this.root;
    }
    onDispose() {}
    getVisuals() : any {
        throw new Error('Could not get canvas: The Output did not create a canvas');
    }
    getAudio() : any {
        throw new Error('Could not get audio context: The output did not create an AudioContext');
    }
    abstract getDOM() : IDOMContext;
    abstract resize() : void;
};

export default OutputViewProvider;
