import '@kano/styles/typography.js';
import { LitElement, customElement, html, property, css } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map';
import { BlocklyEditorBannerWidget } from '../../../../widget/blockly-banner.js';
import { IRemixSuggestion } from '../../../../remix/remix.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';

@customElement('kc-remix-suggestions')
export class RemixSuggestions extends LitElement {

    @property({ type: String })
    title : string = ''

    @property({ type: Array })
    suggestions : string[] = [];

    @property({ type: Number })
    selectedSuggestionIndex : number = -1;

    static get styles() {
        return [css`
            :host {
                display: flex;
                flex-direction: column;
                font-family: var(--font-body);
                background: white;
                border-radius: 6px;
            }
            .suggestions {
                display: flex;
                flex-direction: column;
            }
            .suggestions>button {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 8px;
                font-size: 14px;
                font-family: inherit;
                text-align: left;
            }
            .suggestions>button.selected {
                font-weight: bold;
            }
            .header {
                padding: 8px;
                font-size: 16px;
                font-weight: bold;
                border-bottom: 1px solid black;
            }
        `];
    }

    render() {
        return html`
            <div class="header">${this.title}</div>
            <div class="suggestions">
                ${this.suggestions.map((s, index) => html`
                    <button @click=${() => this._onClick(index)} class=${classMap({ selected: this.selectedSuggestionIndex === index })}>${s}</button>
                `)}
            </div>
        `;
    }
    _onClick(index : number) {
        this.dispatchEvent(new CustomEvent('suggestion-clicked', { detail: index }));
    }
}

export class SuggestionsWidget extends BlocklyEditorBannerWidget {
    private title : string;
    private suggestions : IRemixSuggestion[];
    private listEl? : RemixSuggestions;
    private _onDidSelectSuggestion : EventEmitter<IRemixSuggestion> = new EventEmitter();
    get onDidSelectSuggestion() { return this._onDidSelectSuggestion.event; }
    constructor(title: string, suggestions : IRemixSuggestion[]) {
        super();
        this.suggestions = suggestions;
        this.title = title;
    }
    getDomNode() {
        const domNode = super.getDomNode();
        if (!this.listEl) {
            this.listEl = new RemixSuggestions();
            this.listEl.suggestions = this.suggestions.map(s => s.title);
            this.listEl.title = this.title;
            subscribeDOM(this.listEl, 'suggestion-clicked', (e : CustomEvent<number>) => {
                if (this.listEl) {
                    this.listEl.selectedSuggestionIndex = e.detail;
                }
                const suggestion = this.suggestions[e.detail];
                this._onDidSelectSuggestion.fire(suggestion);
            });
            domNode.appendChild(this.listEl);
        }
        return domNode;
    }
}