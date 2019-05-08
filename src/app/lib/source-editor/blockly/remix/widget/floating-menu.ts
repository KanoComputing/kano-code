import '@kano/styles/typography.js';
import { customElement, html, property, css } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map';
import { IRemixSuggestion } from '../../../../remix/remix.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { KCBriefingFloatingMenu, BriefingFloatingMenu } from '../../briefing/widget/floating-menu.js';

@customElement('kc-remix-floating-menu')
export class KCRemixFloatingMenu extends KCBriefingFloatingMenu {

    @property({ type: Array })
    suggestions : string[] = [];

    @property({ type: Number })
    selectedSuggestionIndex : number = -1;

    static get styles() {
        return [css`
            .content>button {
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
            .content>button:focus,
            .content>button:hover,
            .content>button.selected {
                background: var(--color-stone);
                outline: none;
            }
        `].concat(KCBriefingFloatingMenu.styles);
    }
    renderActions() {
        return html`
            <button class="btn secondary" @click=${() => this._onResetClick()}>Reset</button>
            <button class="btn secondary" @click=${() => this._onDoneClick()}>I'm done</button>
            <button class="btn secondary" @click=${() => this._onExamplesClick()}>Examples</button>
        `;
    }
    _onExamplesClick() {
        this.dispatchEvent(new CustomEvent('examples-clicked'));
    }
    renderContent() {
        return this.suggestions.map((s, index) => html`
            <button @click=${() => this._onClick(index)} class=${classMap({ selected: this.selectedSuggestionIndex === index })}>${s}</button>
        `);
    }
    _onClick(index : number) {
        this.dispatchEvent(new CustomEvent('suggestion-clicked', { detail: index }));
    }
}

export class RemixFloatingMenu extends BriefingFloatingMenu {
    protected suggestions : IRemixSuggestion[];
    protected menuNode? : KCRemixFloatingMenu;

    protected _onDidSelectSuggestion : EventEmitter<IRemixSuggestion> = new EventEmitter();
    get onDidSelectSuggestion() { return this._onDidSelectSuggestion.event; }

    protected _onDidRequestExamples : EventEmitter = new EventEmitter();
    get onDidRequestExamples() { return this._onDidRequestExamples.event; }

    constructor(title: string, suggestions : IRemixSuggestion[]) {
        super(title);
        this.title = 'Remix list';
        this.suggestions = suggestions;
    }
    getMenuNode() {
        if (!this.menuNode) {
            this.menuNode = new KCRemixFloatingMenu();
            this.menuNode.title = this.title;
            this.menuNode.header = this.header;
            this.menuNode.suggestions = this.suggestions.map(s => s.title);
            subscribeDOM(this.menuNode, 'suggestion-clicked', (e : CustomEvent<number>) => {
                if (this.menuNode) {
                    this.menuNode.selectedSuggestionIndex = e.detail;
                }
                const suggestion = this.suggestions[e.detail];
                this._onDidSelectSuggestion.fire(suggestion);
            }, this, this.subscriptions);
            subscribeDOM(this.menuNode, 'reset-clicked', () => this._onDidRequestReset.fire(), this, this.subscriptions);
            subscribeDOM(this.menuNode, 'examples-clicked', () => this._onDidRequestExamples.fire(), this, this.subscriptions);
            subscribeDOM(this.menuNode, 'done-clicked', () => this._onDidEnd.fire(), this, this.subscriptions);
        }
        return this.menuNode;
    }
    deselectSuggestion() {
        if (this.menuNode) {
            this.menuNode.selectedSuggestionIndex = -1;
        }
    }
}