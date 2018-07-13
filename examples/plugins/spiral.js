const MAX_OFFSET = 400;
const SPACING = 4;
const POINTS = MAX_OFFSET / SPACING;
const PEAK = MAX_OFFSET * 0.25;
const POINTS_PER_LAP = 6;
const SHADOW_STRENGTH = 6;

export class Spiral {
    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.context = this.canvas.getContext('2d');
        this.time = 0;
        this.velocity = 0.1;
        this.velocityTarget = 0.1;
        this.lastX = 0;
        this.lastY = 0;

        this.color = 'white';
        this.pointsPerLap = POINTS_PER_LAP;
        this.lineWidth = 2;

        this.resize = this.resize.bind(this);
        this.step = this.step.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }
    setup() {
        this.resize();
        this.step();

        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('touchstart', this.onTouchStart);
    }
    dispose() {
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('touchstart', this.onTouchStart);
        cancelAnimationFrame(this.animationId);
    }
    resize() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    step() {
        this.time += this.velocity;
        this.velocity += (this.velocityTarget - this.velocity) * 0.3;

        this.clear();
        this.render();

        this.animationId = requestAnimationFrame(this.step);
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    render() {
        let x;
        let y;
        const cx = this.width / 2;
        const cy = this.height / 2;

        this.context.globalCompositeOperation = 'lighter';
        this.context.strokeStyle = this.color;
        this.context.shadowColor = '#fff';
        this.context.lineWidth = this.lineWidth;
        this.context.beginPath();

        for (let i = POINTS; i > 0; i -= 1) {
            const value = i * SPACING + (this.time % SPACING);

            let ax = Math.sin(value / this.pointsPerLap) * Math.PI,
                ay = Math.cos(value / this.pointsPerLap) * Math.PI;

            x = ax * value,
            y = ay * value * 0.35;

            const o = 1 - (Math.min(value, PEAK) / PEAK);

            y -= Math.pow(o, 2) * 200;
            y += 200 * value / MAX_OFFSET;
            y += x / cx * this.width * 0.1;

            this.context.globalAlpha = 1 - (value / MAX_OFFSET);
            this.context.shadowBlur = SHADOW_STRENGTH * o;

            this.context.lineTo(cx + x, cy + y);
            this.context.stroke();

            this.context.beginPath();
            this.context.moveTo(cx + x, cy + y);
        }

        this.context.lineTo(cx, cy - 200);
        this.context.lineTo(cx, 0);
        this.context.stroke();
    }
    onMouseDown(event) {
        this.lastX = event.clientX;
        this.lastY = event.clientY;

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove(event) {
        let vx = (event.clientX - this.lastX) / 100;
        let vy = (event.clientY - this.lastY) / 100;

        if (event.clientY < this.height / 2) vx *= -1;
        if (event.clientX > this.width / 2) vy *= -1;

        this.velocityTarget = vx + vy;

        this.lastX = event.clientX;
        this.lastY = event.clientY;
    }

    onMouseUp() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    onTouchStart(event) {
        event.preventDefault();

        this.lastX = event.touches[0].clientX;
        this.lastY = event.touches[0].clientY;

        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onTouchEnd);
    }

    onTouchMove(event) {
        let vx = (event.touches[0].clientX - this.lastX) / 100;
        let vy = (event.touches[0].clientY - this.lastY) / 100;

        if (event.touches[0].clientY < this.height / 2) vx *= -1;
        if (event.touches[0].clientX > this.width / 2) vy *= -1;

        this.velocityTarget = vx + vy;

        this.lastX = event.touches[0].clientX;
        this.lastY = event.touches[0].clientY;
    }
    onTouchEnd() {
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
    }
}


export default Spiral;
