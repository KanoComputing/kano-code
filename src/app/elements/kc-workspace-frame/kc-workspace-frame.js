import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { close } from '@kano/icons/ui.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../ui/kano-ui-viewport/kano-ui-viewport.js';
import { button } from '@kano/styles/button.js';

class KcWorkspaceFrame extends PolymerElement {
    static get template() {
        return html`
        ${button}
        <style>
            :host {
                display: block;
            }
            :host(.fullscreen) #content {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 301;
                margin: 0;
            }
            :host #content {
                position: relative;
                width: auto;
                margin-top: 14px;
                transition: background linear 150ms;
            }
            :host.running #content {
                --kano-ui-viewport: {
                    border: none;
                };
            }

            .pause-overlay {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .pause-overlay iron-image {
                width: 40%;
                height: 40%;
                cursor: pointer;
            }
            #workspace-placeholder {
                height: 100%;
            }

            .controls {
                display: flex;
                flex-direction: column;
                /* justify-content: space-between; */
                flex: 1 1 auto;
                box-sizing: border-box;
                margin: 20px;
            }
            :host(:not(.fullscreen)) .overlay {
                display: none;
            }
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 300;
                background: var(--kano-app-editor-workspace-background, #f2f2f2);
            }

            button#fullscreen-close {
                align-self: flex-end;
                background: rgba(255, 255, 255, 0.25);
                color: rgba(255, 255, 255, 0.75);
                border-radius: 3px;
                position: fixed;
                top: 16px;
                right: 16px;
                padding: 0px;
            }
            button#fullscreen-close:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            paper-dialog {
                background: transparent;
            }
            button .icon {
                fill: #8F9195;
                width: 8px;
            }
            button#fullscreen-close {
                display: flex;
                align-items: center;
                justify-content: center;
                fill: rgba(255, 255, 255, 0.75);
            }
            button#fullscreen-close:hover .icon {
                fill: rgba(255, 255, 255, 1);
            }
            button#fullscreen-close {
                width: 20px;
                height: 20px;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <kano-ui-viewport id="content" mode="scaled" view-width="[[width]]" view-height="[[height]]">
            <div id="workspace-placeholder">
                <slot name="workspace"></slot>
            </div>
        </kano-ui-viewport>
        <div class="controls">
            <slot name="controls"></slot>
        </div>
        <div class="overlay">
            <button id="fullscreen-close" class="btn" on-tap="_closeFullscreen">
                <div class="icon">${close}</div>
            </button>
        </div>
        <iron-a11y-keys keys="meta+enter" on-keys-pressed="_goFullscreen" target="[[target]]"></iron-a11y-keys>
        <iron-a11y-keys keys="esc" on-keys-pressed="_cancelFullscreen" target="[[target]]"></iron-a11y-keys>
`;
    }
    static get properties() {
        return {
            running: {
                type: Boolean,
                value: false,
                notify: true,
            },
            width: {
                type: Number,
            },
            height: {
                type: Number,
            },
            fullscreen: {
                type: Boolean,
                value: false,
                observer: '_fullscreenChanged',
            },
        };
    }
    constructor() {
        super();
        this._onResize = this._onResize.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.target = document.body;
        window.addEventListener('resize', this._onResize);
        this._setViewportHeight();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('resize', this._onResize);
    }
    _onResize() {
        this._setViewportHeight();
    }
    addMenuOption(label, icon, callback) {
        return this.$.toolbar.addMenuItem(label, icon, callback);
    }
    _setViewportHeight() {
        window.requestAnimationFrame(() => {
            let aspectRatio = this.height / this.width;
            const { style } = this.$.content;
            if (this.fullscreen) {
                // Portrait
                if (window.innerHeight > window.innerWidth * aspectRatio) {
                    style.width = '70vw';
                    style.height = `calc(70vw * ${aspectRatio})`;
                    style.top = `calc(50% - (70vw * ${aspectRatio} / 2))`;
                    style.left = 'calc(50% - 35vw)';
                } else {
                    // Landscape
                    aspectRatio = 1 / aspectRatio;
                    style.height = '70vh';
                    style.width = `calc(70vh * ${aspectRatio})`;
                    style.top = 'calc(50% - 35vh)';
                    style.left = `calc(50% - (70vh * ${aspectRatio} / 2))`;
                }
            } else {
                // We are not fullscreen so set the viewport
                // height relative to the width of the workspace
                style.width = 'auto';
                style.height = `${this.offsetWidth * aspectRatio}px`;
                style.top = 'auto';
                style.left = 'auto';
            }
        });
        this.$.content.resizeView();
    }
    _goFullscreen() {
        if (!this.fullscreen) {
            this._toggleFullscreen();
        }
    }
    _cancelFullscreen() {
        if (this.fullscreen) {
            this._toggleFullscreen();
        }
    }
    _closeFullscreen() {
        this.dispatchEvent(new CustomEvent('close-fullscreen'));
    }
    _fullscreenChanged() {
        this.classList.toggle('fullscreen', this.fullscreen);
        this._setViewportHeight();
        window.dispatchEvent(new Event('resize'));
    }
    getViewportScale() {
        return this.$.content.getScale();
    }
}

customElements.define('kc-workspace-frame', KcWorkspaceFrame);
