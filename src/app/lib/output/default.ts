import { OutputViewProvider } from './index.js';
import { IVisualsContext, IAudioContext } from './output.js';

export class DefaultOutputViewProvider extends OutputViewProvider {
    private canvas : HTMLCanvasElement;
    private _audioContext : AudioContext = new AudioContext();
    constructor() {
        super();
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.width = '100%';
        this.canvas.style.background = 'white';

        this.root.appendChild(this.canvas);
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
        };
    }
    onDispose() {
        super.onDispose();
        this._audioContext.close();
    }
}

export default DefaultOutputViewProvider;
