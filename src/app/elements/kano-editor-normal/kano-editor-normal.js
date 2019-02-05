import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../kc-workspace-frame/kc-workspace-frame.js';
import '../kc-workspace-frame/kc-parts-controls.js';

class KcWorkspaceDraw extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: flex;
flex-direction: column;
                width: 100%;
                height: 100%;
                padding-top: 12px;
            }
            kc-workspace-frame {
                display: flex;
flex-direction: column;
                flex: 1;
flex-basis: 0.000000001px;
                margin: 0 40px;
            }
            kc-parts-controls {
                flex: 1;
            }
            kano-workspace-normal {
                flex: 1;
flex-basis: 0.000000001px;
            }
            #workspace ::slotted(.data),
            #workspace ::slotted(.hardware),
            #workspace ::slotted(kano-part-oscillator) {
                display: none;
            }
            .part {
                flex: none;
                display: flex;
flex-direction: row;
                align-items: center;
                height: 40px;
                font-size: 14px;
                color: #fff;
                border-bottom: 1px solid #202428;
                cursor: pointer;
            }
            .part .background-icon {
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
                fill: #8f9195;
                margin: 8px 12px 8px 0;
            }
            .part:hover .background-icon {
                fill: rgba(255, 255, 255, 0.8);
            }
            .part .handle {
                color: #3A4248;
            }
        </style>
        <kc-workspace-frame id="wrapper" width="[[width]]" height="[[height]]" running="[[running]]" mouse-x="[[mousePositionX]]" mouse-y="[[mousePositionY]]" show-mouse-position>
            <kc-parts-controls id="parts-controls" slot="controls" parts="[[parts]]" store-id="[[storeId]]">
            </kc-parts-controls>
        </kc-workspace-frame>
`;
    }
    static get properties() {
        return {
            autoStart: Boolean,
            mousePositionX: {
                type: Number,
                value: 250,
                notify: true,
            },
            mousePositionY: {
                type: Number,
                value: 250,
                notify: true,
            },
            running: {
                type: Boolean,
            },
            parts: {
                type: Array,
            },
        };
    }
    constructor() {
        super();
        this.mousePositionX = 250;
        this.mousePositionY = 250;
    }
    connectedCallback() {
        super.connectedCallback();
        // this.$.workspace.addEventListener('mouseover', this._onMouseOver.bind(this));
        // this.$.workspace.addEventListener('mouseout', this._onMouseOut.bind(this));
        // this.$.workspace.addEventListener('mousemove', this._onMouseMove.bind(this));
    }
    getWorkspace() {
        return this.$.workspace;
    }
    _onMouseOver() {
        this._isMouseOver = true;
    }
    _onMouseOut() {
        this._isMouseOver = false;
        this.mousePositionX = 250;
        this.mousePositionY = 250;
    }
    _onMouseMove(e) {
        if (this._isMouseOver) {
            this.rectangle = this.$.workspace.getBoundingClientRect();
            const scalingFactor = this.rectangle.width / this.width;

            this.mousePositionX = parseInt((e.x - this.rectangle.left) / scalingFactor, 10);
            this.mousePositionY = parseInt((e.y - this.rectangle.top) / scalingFactor, 10);
        }
    }
    getRestrictElement() {
        return this.$.workspace;
    }
    getViewport() {
        return this.$.workspace;
    }
    getViewportScale() {
        return this.$.wrapper.getViewportScale();
    }
    setBackground(value) {
        this.$.workspace.setBackground(value);
    }
}

customElements.define('kc-workspace-draw', KcWorkspaceDraw);
