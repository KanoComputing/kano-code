import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/polymer-legacy.js';
import '../../../../elements/inline-controls/kano-value-rendering/kano-value-rendering.js';

class KanoICOscillator extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
    static get is() { return 'kc-oscillator-display'; }
    static get properties() {
        return {
            value: Number,
            part: Object,
        };
    }
    static get template() {
        return html`
            <style>
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
            </style>
            <div class="visuals" id="visuals">
                <canvas id="canvas" height="32"></canvas>
            </div>
            <div class="data">
                <kano-value-rendering width="12" height="12" value="[[value]]"></kano-value-rendering>
            </div>
        `;
    }
    connectedCallback() {
        super.connectedCallback();
        this.ctx = this.$.canvas.getContext('2d');
        this.resize = this.resize.bind(this);
        this.addEventListener('iron-resize', this.resize);
        this._initCanvas();
        this.cache = document.createElement('canvas');
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        cancelAnimationFrame(this._nextFrameId);
        this.removeEventListener('iron-resize', this.resize);
    }
    resize() {
        this.$.canvas.width = this.$.canvas.offsetWidth;
    }
    _initCanvas() {
        if (this._nextFrameId) {
            cancelAnimationFrame(this._nextFrameId);
        }
        this.$.canvas.style.width = '100%';
        this.resize();
        this.async(() => this._render());
    }
    _render(timestamp) {
        let yScale = 0.5,
            width = this.$.canvas.width,
            height = 31,
            iterations = width / 0.5,
            middle = iterations / 2,
            x,
            y;
        this.ctx.fillStyle = 'black';
        this.ctx.clearRect(0, 0, this.$.canvas.width, this.$.canvas.height);
        this.ctx.beginPath();
        for (let i = 0; i < iterations; i++) {
            x = i / 2;
            y = height - this.part.getValueAt(this.part.core.x - i + iterations) * height / 100;
            y *= yScale;
            y += (height - (height * yScale)) / 2;
            // only draw the line when not over the value marker
            if (i < middle - 2 || i > middle + 2) {
                this.ctx.lineTo(x, y);
            } else {
                this.ctx.moveTo(x, y);
            }
            if (i === middle) {
                this.ctx.strokeStyle = '#8F9195';
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.beginPath();
            }
        }
        this.ctx.strokeStyle = '#8F9195';
        this.ctx.stroke();
        this.ctx.closePath();

        if (!this.prevTimestamp || timestamp - this.prevTimestamp > 64) {
            this.prevTimestamp = timestamp;
            this.set('value', Math.round(this.part.value));
        }

        this._nextFrameId = requestAnimationFrame(this._render.bind(this));
    }
}

customElements.define(KanoICOscillator.is, KanoICOscillator);
