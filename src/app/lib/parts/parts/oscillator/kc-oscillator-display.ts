import '../../../../elements/inline-controls/kano-value-rendering/kano-value-rendering.js';
import { OscillatorPart } from './oscillator.js';
import { LitElement, html, customElement, property, css, query } from 'lit-element';

const _cache = new Map();

@customElement('kc-oscillator-display')
export class KCOscillatorDisplay extends LitElement {
    @property({ type: Number })
    value = 0;
    @property({ type: Object })
    part? : OscillatorPart;
    private canvas : HTMLCanvasElement = document.createElement('canvas');
    private ctx? : CanvasRenderingContext2D;
    private _nextFrameId : number|null = null;
    private prevTimestamp : number|null = null;
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
    render() {
        return html`
            <div class="visuals" id="visuals">
                ${this.canvas}
            </div>
            <div class="data">
                <kano-value-rendering width="20" height="12" .value=${this.value}></kano-value-rendering>
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
    /**
     * Generate a 50x50 canvas to store a cycle of the oscillator visualisation
     * Use that image to paint the wave by repeating it on the x axis
     * Use a global cache so that every single part share the same sprite
     */
    _generateCache(wave : string) {
        if (!this.part) {
            return;
        }
        const cache = document.createElement('canvas');
        cache.width = 50;
        cache.height = 50;
        const ctx = cache.getContext('2d')!;

        let yScale = 0.5;
        let height = 31;
        let iterations = cache.width / 0.5;
        let x;
        let y;
        ctx.clearRect(0, 0, cache.width, cache.height);
        ctx.beginPath();
        for (let i = 0; i < iterations + 1; i++) {
            x = i / 2;
            y = KCOscillatorDisplay.getY(this.part.getValueAt(wave === 'triangle' ? i + 50 : i), height, yScale);
            if (wave === 'triangle') {
                y += 8;
            }
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#8F9195';
        ctx.stroke();
        ctx.closePath();

        _cache.set(wave, cache);
    }
    _render(timestamp? : number) {
        if (!this.part || !this.ctx) {
            this._nextFrameId = requestAnimationFrame(this._render.bind(this));
            return;
        }
        const canvas = this.canvas;
        if (!_cache.has(this.part.core.wave)) {
            this._generateCache(this.part.core.wave);
        }
        const waveCache = _cache.get(this.part.core.wave);
        const width = canvas.width;
        this.ctx.fillStyle = 'black';
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        const iterations = Math.ceil(width / 50);
        const start = -(Math.ceil((iterations / 2) + 1));
        const end = Math.ceil(iterations / 2);
        for (let i = start; i < end; i += 1) {
            this.ctx.drawImage(waveCache, Math.round(width / 2 + (i * 50 + (this.part.core.x / 2))), 0);
        }
        this.ctx.beginPath();
        let y = 31 - KCOscillatorDisplay.getY(this.part.value, 31, 0.5);
        this.ctx.arc(width / 2, y, 2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.closePath();

        if (!this.prevTimestamp || timestamp! - this.prevTimestamp > 64) {
            this.prevTimestamp = timestamp!;
            this.value = Math.round(this.part.value);
        }

        this._nextFrameId = requestAnimationFrame(this._render.bind(this));
    }
}
