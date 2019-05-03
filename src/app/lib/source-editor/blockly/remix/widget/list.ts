import '@kano/styles/typography.js';
import { LitElement, customElement, html, property, css } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map';
import { BlocklyEditorBannerWidget } from '../../../../widget/blockly-banner.js';
import { IRemixSuggestion } from '../../../../remix/remix.js';
import { EventEmitter, subscribeDOM, IDisposable } from '@kano/common/index.js';
import { templateContent } from '../../../../directives/template-content.js';
import { button } from '@kano/styles/button.js';

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
                overflow: hidden;
                display: flex;
                flex-direction: column;
                font-family: var(--font-body);
                background: white;
                border-radius: 6px;
                box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
                color: var(--color-black);
                max-width: 240px;
                align-self: flex-end;
            }
            .suggestions {
                display: flex;
                flex-direction: column;
                padding: 8px 24px;
            }
            .suggestions>button {
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 18px;
                font-family: inherit;
                font-weight: bold;
                text-align: left;
                color: inherit;
                border: 1px solid var(--color-grey);
                border-radius: 6px;
                padding: 8px;
                margin-bottom: 4px;
            }
            .suggestions>button:focus,
            .suggestions>button:hover,
            .suggestions>button.selected {
                background: var(--color-stone);
                outline: none;
            }
            .title {
                background: var(--color-grey);
                color: white;
                padding: 4px 16px;
                font-size: 18px;
                font-weight: bold;
            }
            .header {
                font-size: 18px;
                font-weight: bold;
                padding: 8px 24px;
            }
            .actions {
                padding: 8px 24px 24px;
            }
        `];
    }

    render() {
        return html`
            ${templateContent(button)}
            <div class="title">Remix list</div>
            <div class="header">${this.title}</div>
            <div class="suggestions">
                ${this.suggestions.map((s, index) => html`
                    <button @click=${() => this._onClick(index)} class=${classMap({ selected: this.selectedSuggestionIndex === index })}>${s}</button>
                `)}
            </div>
            <div class="actions">
                <button class="btn secondary" @click=${() => this._onResetClick()}>Reset</button>
                <button class="btn secondary" @click=${() => this._onDoneClick()}>I'm done</button>
                <button class="btn secondary" @click=${() => this._onExamplesClick()}>Examples</button>
            </div>
        `;
    }
    _onResetClick() {
        this.dispatchEvent(new CustomEvent('reset-clicked'));
    }
    _onDoneClick() {
        this.dispatchEvent(new CustomEvent('done-clicked'));
    }
    _onExamplesClick() {
        this.dispatchEvent(new CustomEvent('examples-clicked'));
    }
    _onClick(index : number) {
        this.dispatchEvent(new CustomEvent('suggestion-clicked', { detail: index }));
    }
}

export class SuggestionsWidget extends BlocklyEditorBannerWidget {
    private title : string;
    private suggestions : IRemixSuggestion[];
    private listEl? : RemixSuggestions;
    private subscriptions : IDisposable[] = [];

    private _onDidSelectSuggestion : EventEmitter<IRemixSuggestion> = new EventEmitter();
    get onDidSelectSuggestion() { return this._onDidSelectSuggestion.event; }

    private _onDidRequestReset : EventEmitter = new EventEmitter();
    get onDidRequestReset() { return this._onDidRequestReset.event; }

    private _onDidEnd : EventEmitter = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }

    private _onDidRequestExamples : EventEmitter = new EventEmitter();
    get onDidRequestExamples() { return this._onDidRequestExamples.event; }

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
            }, this, this.subscriptions);
            subscribeDOM(this.listEl, 'reset-clicked', () => this._onDidRequestReset.fire(), this, this.subscriptions);
            subscribeDOM(this.listEl, 'examples-clicked', () => this._onDidRequestExamples.fire(), this, this.subscriptions);
            subscribeDOM(this.listEl, 'done-clicked', () => this._onDidEnd.fire(), this, this.subscriptions);
            domNode.appendChild(this.listEl);
        }
        return domNode;
    }
    deselectSuggestion() {
        if (this.listEl) {
            this.listEl.selectedSuggestionIndex = -1;
        }
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}