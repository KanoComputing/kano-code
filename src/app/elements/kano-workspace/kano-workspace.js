import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class KanoWorkspace extends PolymerElement {
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
                from { opacity: 0 }
                to { opacity: 1 }
            }
        </style>
        <!-- The variable workspace component will be inserted here -->
        <div id="workspace-placeholder"></div>
`;
    }

    static get is() { return 'kano-workspace'; }
    constructor() {
        super();
        this.elements = {};
        this.tappedElement = null;
        this.dropzone = null;
    }
    get view() {
        return this.dropzone;
    }
    appendView(workspaceView) {
        this.workspaceView = workspaceView;
        const placeholder = this.root.querySelector('#workspace-placeholder');
        placeholder.appendChild(workspaceView.root);
    }
    getViewport() {
        return this.$$('.dropzone').getViewport();
    }
    getViewportScale() {
        return this.dropzone.getViewportScale();
    }
}

customElements.define(KanoWorkspace.is, KanoWorkspace);
