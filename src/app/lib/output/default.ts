import { OutputViewProvider } from './index.js';
import { IVisualsContext, IAudioContext } from './output.js';
import { Microphone } from './microphone.js';

export class DefaultOutputViewProvider extends OutputViewProvider {
    private canvas : HTMLCanvasElement;
    private _audioContext : AudioContext = new AudioContext();
    private _microphone : Microphone;
    constructor() {
        super();
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.width = '100%';
        this.canvas.style.background = 'white';

        this.root.appendChild(this.canvas);

        this._microphone = new Microphone(this._audioContext);
    }
    getVisuals() : IVisualsContext {
        return {
            canvas: this.canvas,
            width: 800,
            height: 600,
        };
    }
    getAudio() : IAudioContext {
        return {
            context: this._audioContext,
            destination: this._audioContext.destination,
            microphone: this._microphone,
        };
    }
    onDispose() {
        super.onDispose();
        this._audioContext.close();
    }
}

export default DefaultOutputViewProvider;
