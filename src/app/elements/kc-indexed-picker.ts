import { LitElement, customElement, property, html, css, queryAll, query } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import '@kano/styles/typography.js';
import '@kano/styles/color.js';
import { throttle } from '../lib/decorators.js';
import { arrow } from '@kano/icons/ui.js';
import { templateContent } from '../lib/directives/template-content.js';

export interface IIndexedPickerSection {
    id : string;
    label : string;
    items : IIndexedPickerItem[];
}

export interface IIndexedPickerItem {
    id : string;
    label : string;
    image? : string;
}

@customElement('kc-indexed-picker')
export class KCIndexedPicker extends LitElement {
    @property({ type: Array })
    public items : IIndexedPickerSection[] = [];

    @property({ type: String })
    public selectedSection? : string;

    @property({ type: String })
    public value : string|null = null;

    @query('.items')
    protected scrollContainer? : HTMLElement;

    @queryAll('.section')
    protected sections? : HTMLElement[];

    static get styles() {
        return this.itemStyles.concat([css`
            :host {
                display: flex;
                flex-direction: row;
                font-family: var(--font-body);
                background: #292f35;
                color: white;
            }
            .padder {
                display: flex;
                width: 312px;
                max-width: 312px;
                padding-right: 8px;
            }
            .items {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                max-height: 320px;
                position: relative;
                flex: 1;
                border-left: 2px solid var(--kc-border-color);
                padding: 8px;
            }
            .section {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                flex-shrink: 0;
            }
            .index {
                position: relative;
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                max-height: 320px;
                padding: 8px;
            }
            .set {
                text-align: left;
                font-weight: bold;
                color: white;
                opacity: 0.5;
                background: transparent;
                border: none;
                font-family: inherit;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                flex-shrink: 0;
                flex-direction: row;
                align-items: center;
                /* Adds 13px (9 + 4) to emulate the caret being there. This makes sure the container keeps its width at all time */
                margin-right: 13px;
            }
            .set:hover {
                opacity: 1;
            }
            .set:focus {
                outline: none;
            }
            .set svg {
                width: 9px;
                height: 9px;
                fill: var(--color-kano-orange);
                transform: rotate(-90deg);
                display: none;
            }
            .set.selected {
                opacity: 1;
                margin-right: 0px;
            }
            .set.selected svg {
                display: inline-block;
            }
            .set.selected span {
                margin-left: 4px;
            }
            .items::-webkit-scrollbar {
                width: 6px;
            }
            .items::-webkit-scrollbar-track,
            .items::-webkit-scrollbar-thumb {
                border-radius: 8px;
            }
            .items::-webkit-scrollbar-track {
                background: transparent;
                margin: 9px 0px 8px;
            }
            .items::-webkit-scrollbar-thumb {
                background: var(--kc-color-superdark);
            }
            .items::-webkit-scrollbar-thumb:hover {
                cursor: pointer;
            }
            h3 {
                width: 100%;
                color: white;
                font-family: var(--font-body);
                font-weight: bold;
                font-size: 18px;
                margin: 10px 5px;
            }
        `]);
    }

    render() {
        return html`
            <div class="index">
                ${this.items.map(section => html`
                    <button @click=${() => this.onSectionClick(section)} class=${classMap({ set: true, selected: this.selectedSection === section.id })}>
                        ${templateContent(arrow)}
                        <span>${section.label}</span>
                    </button>
                `)}
            </div>
            <div class="padder">
                <div class="items" @scroll=${this.onScroll}>
                    ${this.items.map(section => html`
                        <div class="section" id=${section.id}>
                            <h3>${section.label}</h3>
                            ${section.items.map(item => this.renderItem(item))}
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    static get itemStyles() {
        return [css`
            .item {
                padding: 8px;
                background: transparent;
                border: 0;
                font-family: inherit;
                font-size: inherit;
                color: inherit;
                width: 100%;
                border-radius: 3px;
                border: 2px solid transparent;
                background: rgba(255, 255, 255, 0.1);
                margin: 4px;
                cursor: pointer;
                color: #ffffff;
                font-family: var(--font-body);
                font-size: 16px;
                text-align: left;
            }
            .item.image {
                width: 64px;
                height: 64px;
                text-align: center;
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
            <button class=${classMap({ 
                    item: true, 
                    image: item.image !== undefined && item.image.length, 
                    selected: this.value === item.id,
                })}
                id=${item.id} @click=${() => this.onItemClick(item)}>
                ${this.renderItemContent(item)}
            </button>
        `;
    }

    renderItemContent(item : IIndexedPickerItem) {
        if(item.image !== undefined && item.image.length) {
            return html`<img src=${item.image} />`;
        }
        return html`<span>${item.label}</span>`;
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateComplete.then(() => {
            this.updateIndex();
        });
    }

    @throttle(200)
    protected onScroll() {
        this.updateIndex();
    }

    protected updateIndex() {
        if (!this.sections || !this.scrollContainer) {
            return;
        }
        const top = this.scrollContainer.scrollTop + 8;
        let selectedSection : HTMLElement|null = null;
        for (let i = this.sections.length - 1; i >= 0; i -= 1) {
            const section = this.sections[i];
            if (top >= section.offsetTop) {
                selectedSection = section;
                break;
            }
        }
        if (!selectedSection) {
            // TODO: DEAL here
            return;
        }
        this.selectedSection = selectedSection.getAttribute('id') || undefined;
    }

    protected onSectionClick(section : IIndexedPickerSection) {
        this.revealSection(section.id);
    }

    protected onItemClick(item : IIndexedPickerItem) {
        this.value = item.id;
        this.dispatchEvent(new CustomEvent('value-changed', { composed: true, bubbles: true, detail: this.value }));
    }

    revealSelectedElement() {
        if (!this.renderRoot) {
            return;
        }
        const el = this.renderRoot.querySelector(`#${this.value}`);
        if (!el) {
            return;
        }
        el.scrollIntoView({ behavior: 'smooth' });
    }

    revealSection(section : string) {
        if (!this.renderRoot) {
            return;
        }
        const el = this.renderRoot.querySelector(`#${section}`);
        if (!el) {
            return;
        }
        el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
}
