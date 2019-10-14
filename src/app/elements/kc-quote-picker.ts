import { html } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';

import { KCIndexedPicker, IIndexedPickerItem } from './kc-indexed-picker.js';

export class KCQuotePicker extends KCIndexedPicker {
    onItemClick(item : IIndexedPickerItem) {
        this.value = item.label;
        this.id = item.id;
        this.dispatchEvent(new CustomEvent('value-changed', { composed: true, bubbles: true, detail: item }));
    }

    renderItem(item : IIndexedPickerItem) {
        return html`
            <button class=${classMap({ item: true, selected: this.id === item.id })}
                id=${item.id} @click=${() => this.onItemClick(item)}>
                ${this.renderItemContent(item)}
            </button>
        `;
    }

    revealSelectedElement() {
        if (!this.renderRoot) {
            return;
        }
        const el = this.renderRoot.querySelector(`#${this.id}`);
        if (!el) {
            return;
        }
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

customElements.define('kc-quote-picker', KCQuotePicker);
