import '@kano/styles/color.js';
import { LitElement, css, svg, customElement, html, property } from 'lit-element/lit-element.js';

@customElement('kc-circle-progress')
export class KcCircleProgress extends LitElement {

    @property({ type: Number })
    radius : number = 56;

    @property({ type: Number })
    strokeWidth : number = 8;

    @property({ type: Number })
    value : number = 0.5;

    static get styles() {
        return [css`
            :host {
                display: block;
            }
            #circle-full {
                fill: transparent;
                stroke:var(--color-stone);
                stroke-linecap: round;
            }
            #circle {
                fill: transparent;
                stroke:var(--color-amber);
                transition: stroke-dashoffset linear 200ms;
                stroke-linecap: round;
                display: block;
            }
        `];
    }
    render() {
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" id="svg" width=${this.radius} height=${this.radius} viewBox="0 0 ${this.radius} ${this.radius}">${this.renderCircles()}</svg>
        `;
    }
    renderCircles() {
        const r = this.radius / 2 - this.strokeWidth / 2;
        const c = Math.PI * (r * 2);
        const val = Math.max(0, Math.min(1, this.value));
        return svg`
            <circle id="circle-full"
                    cx=${this.radius / 2}
                    cy=${this.radius / 2}
                    r=${r}
                    stroke-width="${this.strokeWidth}px"></circle>
            <circle id="circle"
                    cx=${this.radius / 2}
                    cy=${this.radius / 2}
                    r=${r}
                    stroke-width="${this.strokeWidth}px"
                    stroke-dasharray=${c}
                    stroke-dashoffset=${(1 - val) * c}
                    transform="rotate(270, ${this.radius / 2}, ${this.radius / 2})"></circle>
        `;
    }
}
