import { OutputViewProvider } from './index.js';
import { IVisualsContext } from './output.js';

export class DefaultOutputViewProvider extends OutputViewProvider {
    private canvas : HTMLCanvasElement;
    constructor() {
        super();
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.canvas.width = 500;
        this.canvas.height = 500;
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
}

export default DefaultOutputViewProvider;
