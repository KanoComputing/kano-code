import { LitElement, customElement, html, css } from 'lit-element/lit-element.js';

@customElement('kc-beacon')
export class KCBeacon extends LitElement {
    static get styles() {
        return [css`
            @keyframes pop-in {
                0% {
                    transform: scale(0, 0);
                }
                80% {
                    transform: scale(1.3, 1.3);
                }
                100% {
                    transform: scale(1.0, 1.0);
                }
            }
            @keyframes ring {
                0% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                20% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2.5, 2.5);
                    opacity: 0;
                }
            }
            @keyframes beat {
                0% {
                    transform: scale(1, 1);
                }
                10% {
                    transform: scale(1, 1);
                }
                19% {
                    transform: scale(1.2, 1.2);
                }
                20% {
                    transform: scale(1, 1);
                }
                100% {
                    transform: scale(1, 1);
                }
            }
            :host {
                position: relative;
                max-width: 30px;
                display: inline-block;
                top: -15px;
                left: -15px;
            }
            .beacon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .beacon {
                animation: 150ms ease-in pop-in;
                animation-delay: 0ms;
                animation-iteration-count: 1;
            }
            .beacon .core {
                width: 12px;
                height: 12px;
                background: #fec02d;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
                animation: 2s ease-out 1s infinite beat;
            }
            .ring {
                position: absolute;
                top: -25px;
                left: -25px;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: #fec02d;
                box-sizing: border-box;
                transform: scale(0, 0);
            }
            .ring.animate {
                animation: 2s ease-out 1s infinite ring;
            }
        `];
    }
    render() {
        return html`
            <div class="ripple" id="ripple"></div>
            <div class="ring animate" id="ring"></div>
            <div class="beacon" id="beacon">
                <div class="core" id="core"></div>
            </div>
        `;
    }
}