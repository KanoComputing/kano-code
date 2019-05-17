import { OutputViewProvider } from './index.js';
import { IVisualsContext, IAudioContext, IDOMContext } from './output.js';
import { Microphone } from './microphone.js';
import { EventEmitter } from '@kano/common/index.js';

export class DefaultOutputViewProvider extends OutputViewProvider {
    private canvas : HTMLCanvasElement;
    private _audioContext : AudioContext = new AudioContext();
    private _microphone : Microphone;
    private _onDidResize : EventEmitter = new EventEmitter();
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
    resize() {
        this._onDidResize.fire();
    }
    onDispose() {
        super.onDispose();
        this._audioContext.close();
    }
    getDOM() : IDOMContext {
        return {
            root: this.root,
            onDidResize: this._onDidResize.event,
        }
    }
    render(ctx : CanvasRenderingContext2D) {
        // Background color being set using CSS in the editor to allow users
        // to change it multiple times.
        const color = this.canvas.style.backgroundColor || '#FFFFFF';
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw the current canvas over the background color
        ctx.drawImage(this.canvas, 0, 0);
    }
}

export default DefaultOutputViewProvider;
