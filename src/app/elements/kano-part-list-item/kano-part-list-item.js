import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@kano/styles/color.js';
import '@kano/styles/typography.js';

const themeColors = {
    ui: '#00d9c7',
    data: '#9b61bd',
    hardware: '#ef5285',
};
Polymer({
    _template: html`
        <style>
            :host {
                display: flex;
                flex-direction: row;
                align-items: center;
                color: #fff;
                font-size: 14px;
                white-space: nowrap;
                font-family: var(--font-body);
            }
            .icon {
                fill: #8F9195;
                width: 24px;
                height: 24px;
                margin: 8px 12px 8px 0;
                flex-shrink: 0;
            }
            .label {
                min-width: 60px;
            }
            .controls {
                flex: 1 1 auto;
                margin-left: 8px;
            }
            .disconnected {
                color: var(--color-carnation);
            }
        </style>
        <div id="icon" class="icon"></div>
        <div class$="label {{_computeLabelClass(model.connected)}}">[[model.name]] {{_computeLabel(model.connected)}}</div>
        <div class="controls" id="controls"><slot></slot></div>
`,
    is: 'kano-part-list-item',
    properties: {
        model: Object,
    },
    observers: [
        '_iconChanged(model.icon)',
    ],
    listeners: {
        mouseenter: '_applyColor',
        mouseleave: '_unApplyColor',
    },
    _applyColor() {
        this.$.icon.style.fill = themeColors[this.model.partType];
    },
    _unApplyColor() {
        this.$.icon.style.fill = '#8F9195';
    },
    _computeLabelClass(connected) {
        return connected === false ? 'disconnected' : '';
    },
    _computeLabel(connected) {
        if (this.model.partType === 'data') {
            return connected === false ? '(data offline)' : '';
        } else if (this.model.partType === 'hardware') {
            return connected === false ? '(disconnected)' : '';
        }
        return '';
    },
    _iconChanged() {
        this.$.icon.textContent = '';
        if (!this.model.icon) {
            return;
        }
        this.$.icon.appendChild(this.model.icon.content.cloneNode(true));
    },
});
