import { OutputViewProvider } from './index.js';

export class DefaultOutputViewProvider extends OutputViewProvider {
    constructor(...args) {
        super(...args);
        this.root = document.createElement('canvas');
        this.root.width = 500;
        this.root.height = 500;
        this.root.style.width = '100%';
    }
    start() {
        const ctx = this.root.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    get canvas() {
        return this.root;
    }
}

export default DefaultOutputViewProvider;
