import '../../../../elements/inline-controls/kano-value-rendering/kano-value-rendering.js';
import { LitElement, html, customElement, property, css } from 'lit-element';

@customElement('kc-microphone-display')
export class KCMicrophoneDisplay extends LitElement {
    @property({ type: Number })
    value = 0;
    private canvas : HTMLCanvasElement = document.createElement('canvas');
    private ctx? : CanvasRenderingContext2D;
    private _nextFrameId : number|null = null;
    private prevTimestamp : number|null = null;
    public values : number[] = [];
    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                color: white;
            }
            .visuals {
                display: flex;
                flex-direction: row;
                flex: 1 1 auto;
                margin: 0 12px;
            }
            .data {
                width: 32px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-shrink: 0;
            }
        `;
    }
    addValue(v : number) {
        this.values.push(v);
        if (this.values.length > Math.round(this.canvas.width / 8) + 1) {
            this.values.shift();
        }
    }
    render() {
        return html`
            <div class="visuals" id="visuals">
                ${this.canvas}
            </div>
            <div class="data">
                <kano-value-rendering width="12" height="12" .value=${this.value}></kano-value-rendering>
            </div>
        `;
    }
    firstUpdated() {
        this._initCanvas();
    }
    connectedCallback() {
        super.connectedCallback();
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._nextFrameId) {
            cancelAnimationFrame(this._nextFrameId);
        }
        window.removeEventListener('resize', this.resize);
    }
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.ctx = this.canvas.getContext('2d')!;
    }
    _initCanvas() {
        if (this._nextFrameId) {
            cancelAnimationFrame(this._nextFrameId);
        }
        this.canvas.style.width = '100%';
        this.canvas.height = 32;
        this.resize();
        this._render();
    }
    static getY(x : number, height : number, yScale : number) {
        let y = x * height / 100;
        y *= yScale;
        y += height * yScale / 2;
        return y;
    }
    _render(timestamp? : number) {
        if (!this.ctx) {
            this._nextFrameId = requestAnimationFrame(this._render.bind(this));
            return;
        }
        const step = 8,
            height = 32,
            spacing = 2;
        let barHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(0.5, 0.5);
        this.ctx.fillStyle = '#8F9195';
        for (let i = 0; i < this.values.length; i++) {
            barHeight = Math.max(1, this.values[i] / 100 * height);
            this.ctx.fillRect(i * step - spacing, height / 2 - barHeight / 2, step - spacing * 2, barHeight);
        }
        this.ctx.restore();

        this._nextFrameId = requestAnimationFrame(this._render.bind(this));
    }
}
