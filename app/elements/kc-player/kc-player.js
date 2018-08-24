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
            :host([layout="vertical"]) {
                @apply --layout-vertical;
                @apply --layout-center;
            }
            :host([layout="horizontal"]) {
                padding: 16px 60px;
                position: relative;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .user-app {
                @apply --layout-flex;
                @apply --layout-self-stretch;
                height: 100%;
                width: 100%;
            }
            :host(.fullscreen) {
                padding: 5vh 16px;
                position: fixed;
                top: 0px;
                left: 0px;
                max-width: 100%;
                width: 100%;
                height: 100%;
                z-index: 100;
                background-color: var(--color-chateau);
            }
            :host([layout="horizontal"].fullscreen) {
                @apply --layout-vertical-reverse;
                @apply --layout-justified;
                @apply --layout-center;
            }
            :host(.fullscreen) .user-app {
                width: 60%;
                height: 40%;
                margin: auto;
            }
            :host(.fullscreen) kc-player-toolbar {
                margin: 0 auto 40px auto;
                width: 40%;
            }
            :host(.fullscreen) .close {
                cursor: pointer;
                color: var(--color-porcelain);
                height: 16px;
                position: absolute;
                right: 20px;
                top: 20px;
                width: 16px;
            }
            #container {
                @apply(--layout-vertical);
                @apply(--layout-flex);
                @apply(--layout-center);
                @apply(--layout-center-justified);
                position: relative;
                text-align: center;
            }
            #container>* {
                width: 100%;
                height: 100%;
            }
            h1.error {
                color: var(--color-red, red);
            }
            :host([layout="vertical"]) kc-player-toolbar {
                width: 100%;
            }
            :host([layout="horizontal"]) kc-player-toolbar {
                position: absolute;
                right: 0;
                top: 8%;
                z-index: 10;
            }
            :host([layout="horizontal"].fullscreen) kc-player-toolbar {
                position: relative;
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
                <h1 class="error">Something went wrong :(</h1>
                <div>The app just won't run, will it?</div>
            </template>
        </div>
        <template is="dom-if" if="[[showToolbar]]">
            <iron-icon class="icon close" hidden\$="[[!fullscreen]]" icon="kano-icons:close" on-tap="_toggleFullscreen"></iron-icon>
            <kc-player-toolbar layout="[[toolbarLayout]]" running="[[running]]" on-run-button-clicked="_toggleRunning" on-reset-button-clicked="_reset" on-fullscreen-button-clicked="_toggleFullscreen"></kc-player-toolbar>
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
            layout: {
                type: String,
                value: 'vertical',
                reflectToAttribute: true,
            },
            showToolbar: {
                type: Boolean,
                value: false,
            },
            toolbarLayout: {
                type: String,
                computed: '_toolbarLayout(layout, fullscreen)',
            },
            fullscreen: {
                type: Boolean,
                value: false,
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

        fetch(this.src)
            .then(r => r.json())
            .then((creation) => {
                this.player.inject(this.$.container);
                return this.player.load(creation);
            })
            .then(() => {
                this.player.setRunningState(true);
                this.dispatchEvent(new CustomEvent('app-ready'));
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
    _toolbarLayout(layout, fullscreen) {
        return layout === 'vertical' || fullscreen ? 'horizontal' : 'vertical';
    }
}

customElements.define('kc-player', KCPlayer);
