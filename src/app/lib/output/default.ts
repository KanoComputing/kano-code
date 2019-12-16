import { OutputViewProvider } from './index.js';
import Output, { IVisualsContext, IAudioContext, IDOMContext } from './output.js';
import { PartsManager } from '../parts/manager.js';
import { Microphone } from './microphone.js';
import { EventEmitter } from '@kano/common/index.js';
import { DefaultResources } from './default-resources.js';

let audioContextSingleton : AudioContext|null = null;
window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;

/**
 * Returns a singleton instance of an audio context
 */

function getAudioContext() {
    if (!audioContextSingleton || audioContextSingleton.state === 'closed') {
        audioContextSingleton = null;
        audioContextSingleton = new (AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextSingleton;
}

export class DefaultOutputViewProvider extends OutputViewProvider {
    private canvas : HTMLCanvasElement;
    public parts?: PartsManager;
    private _audioContext : AudioContext = getAudioContext();
    private _microphone : Microphone;
    private _onDidResize : EventEmitter = new EventEmitter();
    private _progressBar : HTMLDivElement;
    constructor() {
        super();
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.width = '100%';
        this.canvas.style.background = 'white';

        this._progressBar = document.createElement('div') as HTMLDivElement;
        this._progressBar.style.width = '0%';
        this._progressBar.style.height = '5px';
        this._progressBar.style.background = '#ff6900';
        this._progressBar.style.display = 'none';
        this._progressBar.style.position = 'absolute';
        this._progressBar.style.top = '0px';
        this._progressBar.style.left = '0px';

        this.root.appendChild(this._progressBar);
        this.root.appendChild(this.canvas);

        this._microphone = new Microphone(this._audioContext);
    }
    onInstall(output: Output) {
        super.onInstall(output);
        if (!output.outputResources) {
            output.registerResources(new DefaultResources());
        }
        this.parts = output.parts;
    }
    getVisuals() : IVisualsContext {
        return {
            canvas: this.canvas,
            width: 800,
            height: 600,
        };
    }
    updateProgress(value : number) {
        this._progressBar.style.display = (value <= 0 || value >= 1.0) ? 'none' : 'block';
        this._progressBar.style.width = `${value * 100}%`;
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
        if (!this.parts) {
            return;
        }
        const parts = this.parts.getParts();
        let chain : Promise<void> = Promise.resolve();
        parts.forEach(el => {
            chain = chain.then(() => {
                return Promise.resolve(el.renderComponents(ctx));
            }) as Promise<void>;
        });
        return chain.then(() => { return });
    }

}

export default DefaultOutputViewProvider;
