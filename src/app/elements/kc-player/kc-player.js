/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@kano/kwc-icons/kwc-icons.js';
import { subscribeDOM } from '@kano/common/index.js';
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
                height: 100%;
                justify-content: center;
                align-items: stretch;
                overflow: hidden;
                box-sizing: border-box;
            }
            :host([fullscreen]) {
                padding: 64px 16px;
                position: fixed;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                z-index: 1;
                background-color: #292F35;
            }
            :host([fullscreen]) kc-player-toolbar {
                position: fixed;
                top: 92vh;
            }
            :host([fullscreen]) .close {
                display: flex;
            }
            .close {
                font-family: var(--font-body);
                background: transparent;
                border: none;
                padding: 8px 2px;
                flex-direction: row;
                align-items: center;
                position: absolute;
                top: 8px;
                right: 0;
                display: none;
            }
            .close:focus {
                outline: none;
            }
            .close span {
                font-size: 16px;
                font-family: inherit;
                font-weight: bold;
                color: #FFF;
            }
            .close .icon {
                width: 24px;
                height: 24px;
                margin-left: 13px;
                margin-right: 9px;
                border-radius: 3px;
                background: rgba(255, 255, 255, .25);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.1s ease-in-out;
            }
            .close .icon iron-icon {
                width: 12px;
                color: rgba(255, 255, 255, .75);
                transition: all 0.1s ease-in-out;
            }
            .close:hover {
                cursor: pointer;
            }
            .close:hover .icon {
                background: #FF6900;
            }
            .close:hover iron-icon {
                color: #FFF;
            }
            #container {
                box-shadow: 0 4px 4px 0px rgba(0, 0, 0, 0.15);
                margin-bottom: 20px;
                overflow: hidden;
            }
            .error-message {
                color: var(--color-porcelain);
                font-size: 21px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 400px;
            }
            *[hidden] {
                display: none !important;
            }
            kc-player-toolbar {
                margin: 16px auto;
                position: relative;
                align-self: center;
                bottom: 12px;
            }
        </style>
        <div id="container">
            <template is="dom-if" if="[[failed]]">
                <div class="error-message">This share doesn't work right now.</div>
            </template>
        </div>
        <template is="dom-if" if="[[showToolbar]]">
            <button class="close" on-click="_toggleFullscreen">
                <span>Close</span>
                <div class="icon">
                    <iron-icon icon="kano-icons:close"></iron-icon>
                </div>
            </button>
            <kc-player-toolbar running="[[running]]" on-run-clicked="_toggleRunning" on-reset-clicked="_reset" on-fullscreen-clicked="_toggleFullscreen"></kc-player-toolbar>
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

        this.sub = subscribeDOM(window, 'resize', () => this._triggerResize());

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
        if (this.sub) {
            this.sub.dispose();
        }
    }
    _triggerResize() {
        if (this.player.output.outputViewProvider) {
            this.player.output.outputViewProvider.resize();
        };
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
