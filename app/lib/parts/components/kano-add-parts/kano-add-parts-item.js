import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../../../../elements/kano-icons/parts.js';

Polymer({
    _template: html`
        <style>
            :host {
                @apply --layout-vertical;
                cursor: pointer;
                color: white;
                overflow: hidden;
            }
            :host([disabled]) {
                opacity: 0.4;
                cursor: default;
            }
            #label {
                color: white;
            }
            button.body {
                @apply --layout-horizontal;
                @apply --layout-center;
                background: inherit;
                color: inherit;
                padding: 0;
                border: 0px;
                font-size: 14px;
                font-family: var(--font-body);
                cursor: pointer;
                outline: none;
            }
            button[disabled] {
                cursor: default;
            }
            .number {
                width: 20px;
            }
            #content {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-flex;
            }
            .bin {
                @apply --layout-horizontal;
                @apply --layout-center;
                padding: 4px;
            }
            .bin img {
                width: 14px;
                height: 14px;
            }
            iron-icon {
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
                --iron-icon-fill-color: #8F9195;
                margin: 8px 12px 8px 8px;
            }
            .clear {
                --iron-icon-fill-color: #8F9195;
                margin: 0px;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <button type="button" class="body" on-tap="_tapped" disabled\$="[[disabled]]">
            <div id="content">
                <iron-icon id="part-icon" icon="parts:[[type]]"></iron-icon>
                <div id="label">[[label]]</div>
            </div>
        </button>
`,

    is: 'kano-add-parts-item',

    properties: {
        label: String,
        type: String,
        colorFill: String,
        disabled: Boolean,
    },

    listeners: {
        mouseenter: '_applyColor',
        mouseleave: '_unApplyColor',
    },

    _applyColor() {
        if (this.disabled) {
            return;
        }
        this.$['part-icon'].style.fill = this.colorFill;
    },

    _unApplyColor() {
        if (this.disabled) {
            return;
        }
        this.$['part-icon'].style.fill = '#8f9195';
    },

    _tapped(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.disabled) {
            return;
        }
        this.fire('part-tap', this.type);
    },
});
