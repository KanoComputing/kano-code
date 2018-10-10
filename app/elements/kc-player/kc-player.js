import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@kano/kwc-icons/kwc-icons.js';
import '../kc-player-toolbar/kc-player-toolbar.js';

import { Player } from '../../lib/player/index.js';

/**
@group Kano Elements
@hero hero.svg
@demo demo/index.html
*/
class KCPlayer extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: stretch;
            }
            :host([fullscreen]) {
                padding: 64px 16px;
                position: fixed;
                top: 0px;
                left: 0px;
                max-width: 100%;
                width: 100%;
                height: 100%;
                z-index: 100;
                background-color: #292F35;
            }
            :host([fullscreen]) kc-player-toolbar {
                margin-top: 64px;
            }
            :host([fullscreen]) .close {
                display: block;
            }
            .close {
                display: none;
                cursor: pointer;
                position: absolute;
                top: 0px;
                right: 0px;
                padding: 16px;
                background: transparent;
                border: 0;
            }
            .close .icon {
                color: var(--color-porcelain);
                height: 16px;
                width: 16px;
            }
            #container {
                position: relative;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: stretch;
            }
            #container>* {
                width: 100%;
                height: 100%;
            }
            .error-message {
                color: var(--color-porcelain);
                font-size: 21px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            *[hidden] {
                display: none !important;
            }
            kc-player-toolbar {
                margin-top: 16px;
            }
        </style>
        <div id="container">
            <template is="dom-if" if="[[failed]]">
                <div class="error-message">This share doesn't work right now.</div>
            </template>
        </div>
        <template is="dom-if" if="[[showToolbar]]">
            <button class="close" on-click="_toggleFullscreen">
                <iron-icon class="icon" icon="kano-icons:close"></iron-icon>
            </button>
            <kc-player-toolbar running="[[running]]" on-run-button-clicked="_toggleRunning" on-reset-button-clicked="_reset" on-fullscreen-button-clicked="_toggleFullscreen"></kc-player-toolbar>
        </template>
        `;
    }
    static get properties() {
        return {
            src: {
                type: String,
                observer: '_srcChanged',
            },
            failed: {
                type: Boolean,
                value: false,
            },
            showToolbar: {
                type: Boolean,
                value: false,
            },
            fullscreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
            },
            running: {
                type: Boolean,
                value: true,
            },
        };
    }
    _srcChanged() {
        if (!this.src) {
            return;
        }
        if (this.player) {
            this.player.dispose();
        }
        this.player = new Player();
        this.player.disableFullscreen();

        fetch(this.src)
            .then(r => r.json())
            .then((creation) => {
                this.player.inject(this.$.container);
                return this.player.load(creation);
            })
            .then(() => {
                this.player.setRunningState(true);
            })
            .catch((e) => {
                this.failed = true;
                this.player.dispose();
                throw e;
            });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.player) {
            this.player.dispose();
        }
    }
    _toggleRunning() {
        this.player.toggleRunningState();
        this.running = this.player.getRunningState();
    }
    _reset() {
        this.player.toggleRunningState();
        this.player.toggleRunningState();
    }
    _toggleFullscreen() {
        this.player.toggleFullscreen();
        this.fullscreen = this.player.getFullscreen();
    }
}

customElements.define('kc-player', KCPlayer);
