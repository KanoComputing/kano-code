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

function degreesToRadians(deg: number) {
    return deg * (Math.PI / 180);
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
        this.setTransforms(ctx, el, transform);
        switch(el.title) {
            case 'button':
                this.drawButtonPart(ctx, el, transform);
                break;
            case 'text':
                this.drawTextPart(ctx, el, transform);
                break;
            case 'text-input':
                this.drawTextInputPart(ctx, el as HTMLInputElement, transform);
                break;
            case 'slider':
                this.drawSliderPart(ctx, el as HTMLInputElement, transform);
                break;
            default:
                this.drawOtherPart(ctx, el, transform);
                break;
        }
        // Reset scale, roation and translate of the canvas context
        this.resetTransforms(ctx);
    }

    drawButtonPart(ctx: CanvasRenderingContext2D, el: HTMLElement, transform: ITransform) {
        const height = el.clientHeight;
        const halfHeight = height / 2;

        // circle on left side
        ctx.beginPath();
        ctx.arc(halfHeight, halfHeight, halfHeight, degreesToRadians(90), degreesToRadians(270));
        ctx.fill();
        ctx.closePath();
        // circle on right side
        ctx.beginPath();
        ctx.arc(
            (el.clientWidth) - halfHeight,
            halfHeight,
            halfHeight,
            degreesToRadians(270),
            degreesToRadians(450)
        );
        ctx.fill();
        ctx.closePath();
        // Main body of button
        ctx.fillRect(halfHeight - 1, 0, (el.clientWidth - height) + 2, height);
        // Text for button - values are a little hacked in because rendering the padding isn't accurate 
        // TODO: Find solution for opacity not rendering text perfectly
        ctx.fillStyle = el.style.color || '#ffffff';
        ctx.font = "16px Bariol";
        ctx.fillText(el.textContent || '', halfHeight - 2, 6 + (halfHeight));
    }
    
    drawTextPart(ctx: CanvasRenderingContext2D, el: HTMLElement, transform: ITransform) {
        const halfHeight = el.clientHeight / 2;
        ctx.fillStyle = el.style.color || '#ffffff';
        ctx.font = "16px Bariol";
        ctx.fillText(el.textContent || '', halfHeight - 2, 6 + (halfHeight));
    }
    
    drawTextInputPart(ctx: CanvasRenderingContext2D, el: HTMLInputElement, transform: ITransform) {
        const halfHeight = el.clientHeight / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#8c8c8c';
        ctx.strokeRect(0, 0, el.clientWidth, el.clientHeight);
        ctx.fillRect(0, 0, el.clientWidth, el.clientHeight + 5);
        const valuePresent = el.value && el.value.length > 0;
        // if placeholder, set text color to grey
        ctx.fillStyle = valuePresent ? '#000000' : '#8c8c8c';
        ctx.font = "16px Bariol";
        ctx.fillText(el.value || el.placeholder || '', halfHeight - 2, 6 + (halfHeight));
    }

    drawSliderPart(ctx: CanvasRenderingContext2D, el: HTMLInputElement, transform: ITransform) {
        const value = el.value && parseInt(el.value) > 0 ? parseInt(el.value) / 100 * el.clientWidth : 0;
        ctx.fillStyle = '#8c8c8c';
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(0, 0, el.clientWidth, 4);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = '#666666';
        ctx.fillStyle = '#dddddd';
        ctx.beginPath();
        ctx.arc(value, 2, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    drawOtherPart(ctx: CanvasRenderingContext2D, el: HTMLElement, transform: ITransform) {
        // Error shape so as not to fail silently
        ctx.fillRect(0, 0, 50, 10);
    }

    setTransforms(ctx: CanvasRenderingContext2D, el: HTMLElement, transform: ITransform) {
        const {
            x,
            y,
            scaleX,
            scaleY,
            rotation,
        } = transform;
        const width = el.clientWidth;
        const height = el.clientHeight;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        ctx.fillStyle = el.style.backgroundColor || '#000000';
        // Translate to the middle of the element, then apply scale and rotation
        ctx.translate(x + halfWidth, y + halfHeight);
        ctx.rotate((Math.PI / 180) * rotation);
        ctx.scale(scaleX, scaleY);
        ctx.translate(-halfWidth, -halfHeight);
        ctx.globalAlpha = parseFloat(el.style.opacity || '1');
    }

    resetTransforms(ctx: CanvasRenderingContext2D) {
        // Reset scale, roation and translate of the canvas context
        ctx.globalAlpha = 1;
        ctx.scale(0, 0);
        ctx.rotate(0);
        ctx.translate(0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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
