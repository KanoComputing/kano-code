import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { SoundPlayerBehavior } from '../kano-sound-player-behavior/kano-sound-player-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { Store } from '../../scripts/legacy/store.js';

const behaviors = [
    SoundPlayerBehavior,
    AppElementRegistryBehavior,
];
class KanoWorkspace extends Store.StateReceiver(mixinBehaviors(behaviors, PolymerElement)) {
    static get template() {
        return html`
        <style>
            :host {
                display: flex;
flex-direction: column;
                position: relative;
                border: 0px;
                overflow: hidden;
            }
            :host ::slotted(#dropzone) {
                margin: auto;
                position: relative;
            }
            #workspace-placeholder {
                flex: 1 1 auto;
                display: flex;
flex-direction: column;
            }
            #workspace-placeholder>* {
                flex: 1 1 auto;
                animation: fade-in 200ms linear;
            }
            *[hidden] {
                display: none !important;
            }
            @keyframes fade-in {
                from { opacity: 0 },
                to { opacity: 1 }
            }
        </style>
        <!-- The variable workspace component will be inserted here -->
        <div id="workspace-placeholder"></div>
`;
    }

    static get is() { return 'kano-workspace'; }
    static get properties() {
        return {
            parts: {
                type: Array,
                linkState: 'addedParts',
            },
            running: {
                type: Boolean,
                value: false,
                observer: 'runningChanged',
                linkState: 'running',
            },
            mode: {
                type: Object,
                linkState: 'mode',
            },
            background: {
                type: String,
                linkState: 'background',
                observer: 'backgroundChanged',
            },
        };
    }
    constructor() {
        super();
        this.elements = {};
        this.tappedElement = null;
        this.dropzone = null;
    }
    get view() {
        return this.dropzone;
    }
    backgroundChanged(bg) {
        const dropzone = this.$$('.dropzone');
        if (dropzone && dropzone.setBackground) {
            dropzone.setBackground(bg);
        }
    }
    appendView(workspaceView) {
        this.workspaceView = workspaceView;
        const placeholder = this.$$('#workspace-placeholder');
        placeholder.appendChild(workspaceView.root);
    }
    runningChanged() {
        if (this.running) {
            this.classList.add('running');
        } else {
            this.classList.remove('running');
        }
    }
    getViewport() {
        return this.$$('.dropzone').getViewport();
    }
    getViewportScale() {
        return this.dropzone.getViewportScale();
    }
}

customElements.define(KanoWorkspace.is, KanoWorkspace);
