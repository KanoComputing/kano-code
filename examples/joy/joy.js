export class Joy {
    static render(canvas, step = 10) {
        const context = canvas.getContext('2d');

        const { width } = canvas;

        context.fillStyle = '#f9f9f9';
        context.lineWidth = 2;

        const lines = [];

        // Create the lines
        for (let i = step; i <= width - step; i += step) {
            const line = [];
            for (let j = step; j <= width - step; j += step) {
                const distanceToCenter = Math.abs(j - (width / 2));
                const variance = Math.max((width / 2) - 50 - distanceToCenter, 0);
                const random = Math.random() * variance / 2 * -1;
                const point = { x: j, y: i + random };
                line.push(point);
            }
            lines.push(line);
        }

        let j = 0;
        // Do the drawing
        for (let i = 0; i < lines.length; i += 1) {
            context.beginPath();
            context.moveTo(lines[i][0].x, lines[i][0].y);
            for (j = 0; j < lines[i].length - 2; j += 1) {
                const xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
                const yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
                context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
            }

            context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);
            context.fill();

            context.stroke();
        }
    }
}

export default Joy;
