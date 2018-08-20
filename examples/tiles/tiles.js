export class Tiles {
    constructor(nx, ny, draw) {
        this.nx = nx;
        this.ny = ny;
        this.userDraw = draw;
    }
    render(canvas) {
        const ctx = canvas.getContext('2d');
        const xStep = ctx.canvas.width / this.nx;
        const yStep = ctx.canvas.height / this.ny;
        for (let x = 0; x < ctx.canvas.width; x += xStep) {
            for (let y = 0; y < ctx.canvas.height; y += yStep) {
                this.userDraw(ctx, x, y, xStep, yStep);
            }
        }
    }
}

export default Tiles;
