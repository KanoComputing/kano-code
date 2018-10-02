import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@kano/polymer-sortablejs/polymer-sortablejs.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../kano-icons/kc-ui.js';
import '../kano-part-list-item/kano-part-list-item.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import { AppEditorBehavior } from '../behaviors/kano-app-editor-behavior.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { Store } from '../../scripts/legacy/store.js';

class KCPartsControls extends Store.StateReceiver(mixinBehaviors([
    I18nBehavior,
    AppEditorBehavior,
    AppElementRegistryBehavior,
    IronResizableBehavior,
], PolymerElement)) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            .add-parts {
                @apply --layout-horizontal;
                @apply --layout-center;
                border-bottom: 1px solid #202428;
            }
            .add-parts label {
                margin: 0;
                cursor: pointer;
            }
            button#add-part-button {
                @apply --layout-self-end;
                @apply --kano-button;
                background: rgba(255, 255, 255, 0.25);
                color: rgba(255, 255, 255, 0.75);
                border-radius: 3px;
            }
            button#add-part-button {
                @apply --layout-horizontal;
                padding: 8px 10px;
                font-size: 12px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
            }
            button#add-part-button:hover {
                background: #fd6a21;
            }
            button#add-part-button:hover > label {
                color: white;
            }
            button>* {
                margin: 0 auto;
            }
            paper-dialog {
                background: transparent;
            }
            .part-list {
                @apply --layout-flex;
                @apply --layout-vertical;
                overflow: auto;
                padding-bottom: 40px;
            }
            .part {
                @apply --layout-flex-none;
                @apply --layout-horizontal;
                @apply --layout-center;
                border-bottom: 1px solid #202428;
                height: 40px;
                color: #fff;
            }
            .part.sortable-ghost {
                opacity: 0.3;
            }
            .part.sortable-drag {
                background-color: var(--kano-app-editor-workspace-background);
                box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.75);
            }
            kano-part-list-item {
                @apply --layout-flex;
                cursor: pointer;
                max-width: 100%;
            }
            iron-icon {
                --iron-icon-width: 27px;
                --iron-icon-height: 27px;
                --iron-icon-fill-color: #8F9195;
            }
            button#add-part-button iron-icon {
                fill: rgba(255, 255, 255, 0.75);
            }
            button#add-part-button:hover iron-icon {
                fill: rgba(255, 255, 255, 1);
            }
            button#add-part-button iron-icon {
                --iron-icon-width: 16px;
                --iron-icon-height: 16px;
                margin-right: 0px;
            }
            .handle {
                cursor: move;
            }
            button.remove {
                background: inherit;
                cursor: pointer;
                line-height: 0;
                border: 0;
                padding: 0;
            }
            .remove:hover iron-icon {
                fill: var(--color-rhubarb);
            }
            iron-icon.handle:hover {
                fill: #fff;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <div class="add-parts">
            <button id="add-part-button" type="button" on-tap="_addPartsTapped">
                <label for="add-part-button">[[localize('ADD_PARTS', 'Add Parts')]]</label>
                <iron-icon icon="kc-ui:add"></iron-icon>
            </button>
        </div>
        <div class="part-list">
            <slot name="extra-parts"></slot>
            <!-- <sortable-js handle=".handle" animation="150"> -->
                <template is="dom-repeat" items="[[parts]]" as="part" on-dom-change="_partsElementsRepeaterChanged">
                    <div class="part" id\$="part-[[part.id]]">
                        <kano-part-list-item model="{{part}}" on-tap="_partItemTapped"></kano-part-list-item>
                        <button type="button" class="remove">
                            <iron-icon icon="kc-ui:close" on-tap="_removePart"></iron-icon>
                        </button>
                        <!-- <iron-icon class="handle" icon="kc-ui:handle"></iron-icon> -->
                    </div>
                </template>
            <!-- </sortable-js> -->
        </div>
`;
    }

    static get is() { return 'kc-parts-controls'; }
    static get properties() {
        return {
            partsMenuOpen: {
                type: Boolean,
                value: false,
                notify: true,
            },
            noPartsControls: {
                type: Boolean,
            },
            parts: {
                linkState: 'addedParts',
            },
        };
    }
    static get observers() {
        return [
            '_partsAddedOrRemoved(parts.splices)',
        ];
    }
    _partsAddedOrRemoved(changeRecord) {
        if (changeRecord && changeRecord.keySplices) {
            changeRecord.keySplices.forEach((splice) => {
                const added = splice.added,
                    removed = splice.removed;
                added.forEach((key) => {
                    const part = this.get(`parts.${key}`);
                    if (!part) {
                        return;
                    }
                    this._partsToAnimateIn.push(part);
                });
            });
        }
    }
    _partsElementsRepeaterChanged() {
        let allPartsEl = dom(this.root).querySelectorAll('.part'),
            partEl,
            partElId;
        for (let i = 0; i < allPartsEl.length; i++) {
            partEl = allPartsEl[i];
            partElId = partEl.getAttribute('id');
            this._registerElement(`parts-controls-${partElId}`, partEl);
        }
        this._partsToAnimateIn.forEach((part) => {
            let partEl = this.$$(`#part-${part.id}`),
                partInlineControlsEl;
            if (!partEl) {
                return;
            }
            if (this.animationSupported) {
                partEl.querySelector('kano-part-list-item').animate({
                    opacity: [0, 1],
                }, {
                    duration: 300,
                    fill: 'forwards',
                });
            } else {
                partEl.querySelector('kano-part-list-item').style.opacity = 1;
            }   
        });
        this._partsToAnimateIn = [];
    }
    constructor() {
        super();
        this.animationSupported = 'animate' in HTMLElement.prototype;
        this._partsToAnimateIn = [];
    }
    connectedCallback() {
        super.connectedCallback();
        this._registerElement('add-part-button', this.$['add-part-button']);
    }
    _addPartsTapped() {
        this._openPartsModal();
    }
    _openPartsModal() {
        this.fire('open-parts-dialog');
    }
    _removePart(e) {
        const part = e.model.get('part');
        this.fire('remove-part', part);
    }
    _partItemTapped(e) {
        e.preventDefault();
        const part = e.model.get('part');
        this.fire('part-selected', part);
    }
}
customElements.define(KCPartsControls.is, KCPartsControls);
