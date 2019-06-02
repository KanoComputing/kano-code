import { KCIndexedPicker, IIndexedPickerItem } from '../../../../../elements/kc-indexed-picker.js';
import { customElement, html, css } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';

@customElement('kc-sample-picker')
export class KCSamplePicker extends KCIndexedPicker {

    static get styles() {
        return super.styles.concat([css`
            .section {
                flex-direction: column;
            }
        `]);
    }

    static get itemStyles() {
        return [css`
            .item {
                padding: 12px;
                background: transparent;
                border: 0;
                font-family: inherit;
                font-size: inherit;
                color: rgba(255, 255, 255, 0.6);
                border-radius: 5px;
                border: 2px solid transparent;
                background: rgba(255, 255, 255, 0.1);
                margin: 4px;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            .glyph {
                width: 16px;
                height: 16px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 3px;
                margin-right: 8px;
            }
            .item.selected {
                border-color: white;
            }
            .item:focus {
                outline: none;
            }
            .item img {
                width: 100%;
                height: 100%;
            }
        `];
    }

    renderItem(item : IIndexedPickerItem) {
        return html`
            <button class=${classMap({ item: true, selected: this.value === item.id })} id=${item.id} @click=${() => this.onItemClick(item)}>
                <span class="glyph"></span>
                <span>${item.label}</span>
            </button>
        `;
    }
}
