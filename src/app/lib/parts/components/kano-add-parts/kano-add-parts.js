import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@kano/kwc-style/kwc-style.js';
import './kano-add-parts-item.js';
import '../../../../elements/kano-style/themes/dark.js';

import { localize } from '../../../i18n/index.js';

class KanoAddParts extends PolymerElement {
    static get is() { return 'kano-add-parts'; }
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-vertical;
                max-height: inherit;
                color: white;
                background-color: var(--kano-app-editor-workspace-background);
                font-family: var(--font-body);
                border-radius: 6px;
            }
            .category-box {
                overflow: auto;
                padding: 24px 32px;
            }
            .category-box h2 {
                font-weight: normal;
                font-size: 16px;
                margin: 0;
            }
            .underline {
                @apply --layout-self-stretch;
                height: 4px;
                border-radius: 6px;
                margin: 24px 0;
            }
            .categories {
                @apply --layout-horizontal;
            }
            .category-box .categories>* {
                width: 238px;
                @apply --layout-vertical;
                @apply --layout-start-justified;
                @apply --layout-flex;
            }
            .category-box .categories>*:not(:first-of-type) {
                margin-left: 32px;
            }
            .category-box .categories .ui .underline {
                background-color: #00d9c7;
            }
            .category-box .categories .data .underline {
                background-color: #9b61bd;
            }
            .category-box .categories .hardware .underline {
                background-color: #ef5285;
            }
            header {
                @apply --layout-horizontal;
                @apply --layout-center;
                flex-shrink: 0;
                height: 58px;
                padding: 0 16px;
                border-bottom: 2px solid #252A30;
            }
            header .label {
                @apply --layout-flex;
                font-size: 16px;
                font-weight: bold;
            }
            .button {
                @apply --kano-button;
                padding: 8px 24px;
                font-size: 14px;
                font-weight: bold;
                border-radius: 3px;
                background: #54595d;
                text-shadow: none;
            }
            .button:hover {
                background-color: #5b646b;
            }
            kano-add-parts-item {
                @apply --layout-center-justified;
                width: 100%;
                height: 40px;
                background-color: var(--color-chateau);
                border-radius: 3px;
                margin-bottom: 16px;
            }
            kano-add-parts-item:hover:not([disabled]) {
                background-color: #5b646b;
            }
            .no-part {
                @apply --layout-horizontal;
                @apply --layout-center;
                background-color: #22272d;
                width: 802px;
                border-radius: 6px;
                margin: 40px;
                padding: 32px;
            }
            .no-part #badge {
                box-sizing: border-box;
                border-radius: 50%;
                background: #ea0923;
                padding: 12px;
                margin: 6px 28px 6px 4px;
            }
            .no-part #badge iron-icon {
                transform: rotate(-9deg);
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
            }
            .no-part-text {
                @apply --layout-flex-auto;
                display: block;
                margin-right: 40px;
            }
            .no-part-text h2 {
                margin-top: 0;
            }
            .no-part button.confirm {
                @apply --kano-button;
                background-color: #54595d;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                border-radius: 6px;
                padding: 8px 24px;
            }
            .no-part button.confirm:hover {
                background-color: #5b646b;
            }
            [hidden] {
              display: none !important;
            }

        </style>
        <header>
            <div class="label">[[localize('ADD_PARTS', 'Add Parts')]]</div>
            <button type="button" class="button" dialog-dismiss="">[[localize('DONE', 'Done')]]</button>
        </header>
        <div class="no-part" hidden\$="[[!empty]]">
            <div id="badge">
                <iron-icon src="/assets/icons/exclamation.svg"></iron-icon>
            </div>
            <div class="no-part-text">
                <h2>[[localize('NO_PARTS_HEADER', 'No parts available')]]</h2>
                <div>[[localize('NO_PARTS_TEXT', 'No parts here yet. Complete the challenge to unlock them all!')]]</div>
            </div>
            <button dialog-confirm="" class="confirm">[[localize('GOT_IT', 'Got it')]]</button>
        </div>
        <div class="category-box" hidden\$="[[empty]]">
            <div class="categories">
                <div class="ui">
                    <h2>Interface</h2>
                    <div class="underline"></div>
                    <template is="dom-repeat" items="[[availableParts]]" filter="[[_getFilter('ui')]]" as="part" on-dom-change="_repeaterChanged">
                        <kano-add-parts-item id\$="[[part.type]]" label="[[part.label]]" type="[[part.type]]" color-fill="#00d9c7" data-animate="150" on-part-tap="_addPart" disabled\$="[[_isPartDisabled(part, _usedParts)]]"></kano-add-parts-item>
                    </template>
                </div>
                <div class="data">
                    <h2>Data</h2>
                    <div class="underline"></div>
                    <template is="dom-repeat" items="[[availableParts]]" filter="[[_getFilter('data')]]" as="part" on-dom-change="_repeaterChanged">
                        <kano-add-parts-item id\$="[[part.type]]" label="[[part.label]]" type="[[part.type]]" color-fill="#9b61bd" data-animate="150" on-part-tap="_addPart" disabled\$="[[_isPartDisabled(part, _usedParts)]]"></kano-add-parts-item>
                    </template>
                </div>
                <div class="hardware">
                    <h2>Hardware</h2>
                    <div class="underline"></div>
                    <template is="dom-repeat" items="[[availableParts]]" filter="[[_getFilter('hardware')]]" as="part" on-dom-change="_repeaterChanged">
                        <kano-add-parts-item id\$="[[part.type]]" label="[[part.label]]" type="[[part.type]]" color-fill="#ef5285" data-animate="150" on-part-tap="_addPart" disabled\$="[[_isPartDisabled(part, _usedParts)]]"></kano-add-parts-item>
                    </template>
                </div>
            </div>
        </div>
`;
    }
    static get properties() {
        return {
            availableParts: {
                type: Array,
                observer: '_onAvailablePartsChanged',
            },
            empty: {
                type: Boolean,
                value: false,
            },
            usedParts: {
                type: Array,
                value: () => [],
            },
            _usedParts: {
                type: Array,
                computed: '_computeUsedPartsIndex(usedParts.splices)',
            },
        };
    }
    constructor() {
        super();
        this.selection = {};
    }
    localize(...args) {
        return localize(...args);
    }
    _onAvailablePartsChanged(parts) {
        this.empty = !parts.length;
    }
    _getFilter(type) {
        return (item) => item.partType === type;
    }
    _addPart(e) {
        const type = e.detail;
        this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, detail: type }));
    }
    reset() {
        this.selection = {};
    }
    _repeaterChanged(e) {
        const target = e.path ? e.path[0] : e.target;
        const elements = [...dom(target.parentNode).querySelectorAll('kano-add-parts-item')];
        this.dispatchEvent(new CustomEvent('elements-changed', { detail: elements, bubbles: true }));
    }
    _computeUsedPartsIndex() {
        return this.usedParts.map(part => part.type);
    }
    _isPartDisabled(part) {
        // Part is a singleton and was added before, disable it
        return part.singleton && this._usedParts.indexOf(part.type) !== -1;
    }
}

customElements.define(KanoAddParts.is, KanoAddParts);
