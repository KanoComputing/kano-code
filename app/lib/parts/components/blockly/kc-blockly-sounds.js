import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@kano/kwc-picker/kwc-picker.js';

class KCBlocklySounds extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                }
            </style>
            <kwc-picker items="[[_items]]" id="picker" name="[[name]]"></kwc-picker>
        `;
    }
    static get is() { return 'kc-blockly-sounds'; }
    static get properties() {
        return {
            name: {
                type: String,
                value: 'Sounds',
            },
            items: {
                type: Array,
            },
            _items: {
                type: Array,
                computed: '_computeItems()',
            },
            value: {
                type: String,
                notify: true,
                observer: '_valueChanged',
            },
        };
    }
    _computeItems() {
        const result = this.items.map(item => Object.assign({}, item, {
            label: item.label || item.value,
        }));
        return result;
    }
    connectedCallback() {
        super.connectedCallback();
        this.setValue = this.setValue.bind(this);
        this.$.picker.addEventListener('selected-changed', this.setValue);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.$.picker.removeEventListener('selected-changed', this.setValue);
    }
    setValue(e) {
        this.set('value', e.detail.value.value);
    }
    _valueChanged(value) {
        const index = this._items.findIndex(item => item.value === value);
        this.$.picker.selectedIndex = index;
    }
}

customElements.define(KCBlocklySounds.is, KCBlocklySounds);
