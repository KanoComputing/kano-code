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
                    opacity: 0.8;
                }
                20% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 2 */
                20.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                21% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                40% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 3 */
                40.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                41% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                60% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 4 */
                60.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                61% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                80% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 5 */
                80.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                81% {
                    transform: scale(0, 0);
                    opacity: 1.0;
                }
                100% {
                    transform: scale(2.5, 2.5);
                    opacity: 0;
                }
            }
            @keyframes jump {
                0% {
                    transform: scale(1.0, 1.0);
                }
                80% {
                    transform: scale(1.0, 1.0);
                }
                82% {
                    transform: scale(1.3, 1.3);
                }
                83.5% {
                    transform: scale(0.9, 0.9);
                }
                85% {
                    transform: scale(1, 1);
                }
                100% {
                    transform: scale(1.0, 1.0);
                }
            }
            @keyframes ripple {
                0% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                80% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                89% {
                    opacity: 0.05;
                }
                100% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
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
            }
            .beacon .core {
                animation: 5s ease-in-out jump;
                animation-delay: 400ms;
                animation-iteration-count: infinite;
            }
            .ripple {
                position: absolute;
                top: -135px;
                left: -135px;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                border: 1px solid rgba(254, 192, 45, 1.0);
                box-sizing: border-box;
                transform: scale(0, 0);
            }
            .ripple {
                animation: 5s ease-out ripple;
                animation-delay: 400ms;
                animation-iteration-count: infinite;
            }
            .ring {
                position: absolute;
                top: -10px;
                left: -10px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #fec02d;
                box-sizing: border-box;
                transform: scale(0, 0);
            }
            .ring.animate {
                animation: 5s ease-out infinite ring;
                animation-delay: 400ms;
            }
        `];
    }
    render() {
        return html`
            <div class="ripple" id="ripple" @animationiteration=${this._ringAnimationIterated} on-animationstart="_ringAnimationIterated"></div>
            <div class="ring" id="ring"></div>
            <div class="beacon" id="beacon">
                <div class="core" id="core"></div>
            </div>
        `;
    }
    _ringAnimationIterated() {
        // if (this._ringAnimationCount > 4 || this.idle) {
        //     return;
        // }
        // this._ringSoundTimeout = setTimeout(() => {
        //     // If no mediaPath is set, skip playing the sound
        //     if (this._dingSound) {
        //         this.playSound(this._dingSound);
        //     }
        //     this._ringAnimationCount += 1;
        // }, 4600 * 0.80);
    }
}