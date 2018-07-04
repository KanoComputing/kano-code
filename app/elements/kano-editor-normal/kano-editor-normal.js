import '@polymer/polymer/polymer-legacy.js';
import '../kc-workspace-frame/kc-workspace-frame.js';
import '../kc-workspace-frame/kc-parts-controls.js';
import '../kano-workspace-normal/kano-workspace-normal.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { WorkspaceBehavior } from '../behaviors/kano-workspace-behavior.js';

Polymer({
    _template: html`
        <style>
            :host {
                @apply --layout-vertical;
                width: 100%;
                height: 100%;
                padding-top: 12px;
            }
            kc-workspace-frame {
                @apply --layout-vertical;
                @apply --layout-flex;
                margin: 0 40px;
            }
            kc-parts-controls {
                flex: 1;
            }
            kano-workspace-normal {
                @apply --layout-flex;
            }
            #workspace ::slotted(.data),
            #workspace ::slotted(.hardware),
            #workspace ::slotted(kano-part-oscillator) {
                display: none;
            }
            .part {
                @apply --layout-flex-none;
                @apply --layout-horizontal;
                @apply --layout-center;
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
        <kc-workspace-frame id="wrapper" width="[[width]]" height="[[height]]" running="[[running]]" mouse-x="[[mousePositionX]]" mouse-y="[[mousePositionY]]" show-mouse-position="">
            <kano-workspace-normal id="workspace" width="[[width]]" height="[[height]]" slot="workspace">
                <slot name="part" slot="part"></slot>
            </kano-workspace-normal>
            <kc-parts-controls id="parts-controls" slot="controls" parts-menu-open="[[partsMenuOpen]]" parts="[[parts]]" store-id="[[storeId]]">
                <div class="part" id\$="background" slot="extra-parts" on-tap="_editBackground">
                    <iron-icon class="background-icon" icon="aspect-ratio"></iron-icon>
                    <div>Background</div>
                </div>
            </kc-parts-controls>
        </kc-workspace-frame>
`,

    is: 'kano-editor-normal',
    behaviors: [WorkspaceBehavior],

    properties: {
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
        mode: {
            type: Object,
        },
        running: {
            type: Boolean,
        },
        parts: {
            type: Array,
        },
    },

    ready() {
        this.mousePositionX = 250;
        this.mousePositionY = 250;
    },

    attached() {
        this.$.workspace.addEventListener('mouseover', this._onMouseOver.bind(this));
        this.$.workspace.addEventListener('mouseout', this._onMouseOut.bind(this));
        this.$.workspace.addEventListener('mousemove', this._onMouseMove.bind(this));
    },

    getWorkspace() {
        return this.$.workspace;
    },

    _onMouseOver(e) {
        this._isMouseOver = true;
    },

    _onMouseOut(e) {
        this._isMouseOver = false;
        this.mousePositionX = 250;
        this.mousePositionY = 250;
    },

    _onMouseMove(e) {
        if (this._isMouseOver) {
            this.rectangle = this.$.workspace.getBoundingClientRect();
            const scalingFactor = this.rectangle.width / this.width;

            this.mousePositionX = parseInt(parseInt(e.x - this.rectangle.left) / scalingFactor);
            this.mousePositionY = parseInt(parseInt(e.y - this.rectangle.top) / scalingFactor);
        }
    },

    getRestrictElement() {
        return this.$.workspace;
    },

    getViewport() {
        return this.$.workspace;
    },

    getViewportScale() {
        return this.$.wrapper.getViewportScale();
    },

    _editBackground() {
        this.fire('edit-background');
    },

    setBackground(value) {
        this.$.workspace.setBackground(value);
    },
});
