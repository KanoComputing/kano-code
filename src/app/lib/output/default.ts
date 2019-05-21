import { OutputViewProvider } from './index.js';
import { IVisualsContext, IAudioContext, IDOMContext } from './output.js';
import { Microphone } from './microphone.js';
import { EventEmitter } from '@kano/common/index.js';

interface ITransform {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
}

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
        let parts = [...this.root.children] as HTMLElement[];
        parts = parts.filter(el => el.title.length > 0);
        parts.forEach(el => {
            const transform: ITransform = this.getTransformData(el.style.transform);
            ctx.fillStyle = '#000000';
            this.drawPart(ctx, el, transform);
        });
    }

    drawPart(ctx: CanvasRenderingContext2D, el: HTMLElement, transform: ITransform) {
        switch(el.title) {
            case 'button':
                this.drawButtonPart(ctx, el, transform);
                break;
            default:
                this.drawOtherPart(ctx, el, transform);
                break;
        }
    }

    drawButtonPart(ctx: CanvasRenderingContext2D, el: HTMLElement, transform: ITransform) {
        const {
            x,
            y,
            scaleX,
            scaleY,
            rotation,
        } = transform;
        console.log(el.style);
        ctx.fillStyle = el.style.backgroundColor || '#000000';
        // circle on left side
        const height = el.clientHeight;
        const halfHeight = height / 2;
        ctx.beginPath();
        ctx.arc(x + halfHeight, y + halfHeight, halfHeight, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath()
        // circle on right side
        ctx.beginPath();
        ctx.arc((x + el.clientWidth) - halfHeight, y + halfHeight, halfHeight, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath()
        // Main body of button
        ctx.fillRect(x + halfHeight, y, el.clientWidth - height, height);
        // Text for button - values are a little hacked in because rendering the padding isn't accurate 
        ctx.fillStyle = el.style.color || '#ffffff';
        ctx.font = "16px Bariol";
        ctx.fillText(el.textContent || '', x + halfHeight - 2, 6 + (y + halfHeight));
    }
    
    drawOtherPart(ctx: CanvasRenderingContext2D, el: HTMLElement, transform: ITransform) {
        // const {
        //     x,
        //     y,
        //     scaleX,
        //     scaleY,
        //     rotation,
        // } = transform;
        // ctx.arc(x, y, 10, 0, 2 * Math.PI);
        // ctx.fill();
    }

    getTransformData(str: string | null) {
        if (!str || str.length <= 1) {
            return {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                rotation: 0,
            }
        }
        const strReplaced = str
            .replace('translate(', '')
            .replace('px, ', '^')
            .replace('px) scale(', '^')
            .replace(', ', '^')
            .replace(') rotate(', '^')
            .replace('deg)', '');
        const arr = strReplaced.split('^');
        const [x, y, scaleX, scaleY, rotation] = arr;
        return {
            x: parseInt(x, 10) || 0,
            y: parseInt(y, 10) || 0,
            scaleX: parseInt(scaleX, 10) || 0,
            scaleY: parseInt(scaleY, 10) || 0,
            rotation: parseInt(rotation, 10) || 0,
        };
    }

}

export default DefaultOutputViewProvider;
