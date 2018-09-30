import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@kano/kwc-icons/kwc-icons.js';
import '../kano-icons/kc-ui.js';
import '../kano-animated-svg/kano-animated-svg.js';

class KCPlayerToolbar extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 4px 4px;
                color: white;
            }
            :host *:focus {
                outline: none;
            }
            .icon iron-icon,
            kano-animated-svg {
                color: var(--color-porcelain);
                height: 16px;
                width: 16px;
                margin: 10px 10px;
            }
            .icon kano-animated-svg {
                width: 18px;
                height: 18px;
                --kano-animated-path: {
                    fill: var(--color-porcelain);
                    stroke: var(--color-porcelain);
                    stroke-width: 2px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    transition: all ease-in-out 200ms;
                }
            }
            .icon {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: var(--color-abbey);
                border-radius: 3px;
                cursor: pointer;
                height: 32px;
                width: 32px;
                border-radius: 50%;
                transition: 0.2s background ease-in-out;
                padding: 0;
                border: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .icon.pause {
                width: 40px;
                height: 40px;
            }
            .icon:nth-child(n+3) {
                margin-left: 16px;
            }
            :host([layout="vertical"]) .panel .icon:nth-child(n+2) {
                margin-top: 16px;
            }
            .icon:hover {
                background-color: var(--color-kano-orange);
            }
        </style>
        <button class="fullscreen icon" on-click="fullscreenClicked">
            <iron-icon icon="kc-ui:maximize"></iron-icon>
        </button>
        <button class="pause icon" on-click="pauseClicked">
            <kano-animated-svg width="17" height="20" paths="[[makeButtonIconPaths]]" selected="[[_getRunningStatus(running)]]">
            </kano-animated-svg>
        </button>
        <button class="reset icon" on-tap="resetClicked">
            <iron-icon icon="kano-icons:reset"></iron-icon>
        </button>
        `;
    }
    static get properties() {
        return {
            running: {
                type: Boolean,
            },
        };
    }
    constructor() {
        super();
        this.makeButtonIconPaths = {
            stopped: 'M 4,18 10.5,14 10.5,6 4,2 z M 10.5,14 17,10 17,10 10.5,6 z',
            running: 'M 2,18 6,18 6,2 2,2 z M 11,18 15,18 15,2 11,2 z',
        };
    }
    fullscreenClicked() {
        this.dispatchEvent(new CustomEvent('fullscreen-button-clicked'));
    }
    pauseClicked() {
        this.dispatchEvent(new CustomEvent('run-button-clicked'));
    }
    resetClicked() {
        this.dispatchEvent(new CustomEvent('reset-button-clicked'));
    }
    _getRunningStatus(running) {
        return running ? 'running' : 'stopped';
    }
}

customElements.define('kc-player-toolbar', KCPlayerToolbar);
