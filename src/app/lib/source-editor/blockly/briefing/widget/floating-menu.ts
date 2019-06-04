import '@kano/styles/typography.js';
import { customElement, html } from 'lit-element/lit-element.js';
import { EventEmitter, subscribeDOM, IDisposable } from '@kano/common/index.js';
import { FloatingMenu, KCFloatingMenu } from '../../../../widget/floating-menu.js';

@customElement('kc-briefing-floating-menu')
export class KCBriefingFloatingMenu extends KCFloatingMenu {
    renderActions() {
        return html`
            <button class="btn secondary" @click=${() => this._onResetClick()}>Reset</button>
            <button class="btn secondary" @click=${() => this._onDoneClick()}>I'm done</button>
        `;
    }
    _onResetClick() {
        this.dispatchEvent(new CustomEvent('reset-clicked'));
    }
    _onDoneClick() {
        this.dispatchEvent(new CustomEvent('done-clicked'));
    }
}

export class BriefingFloatingMenu extends FloatingMenu {
    protected menuNode? : KCBriefingFloatingMenu;
    protected subscriptions : IDisposable[] = [];

    protected _onDidRequestReset : EventEmitter = new EventEmitter();
    get onDidRequestReset() { return this._onDidRequestReset.event; }

    protected _onDidEnd : EventEmitter = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }

    constructor(title: string) {
        super('Briefing', title);
    }
    getMenuNode() {
        if (!this.menuNode) {
            this.menuNode = new KCBriefingFloatingMenu();
            this.menuNode.title = this.title;
            this.menuNode.header = this.header;
            subscribeDOM(this.menuNode, 'reset-clicked', () => this._onDidRequestReset.fire(), this, this.subscriptions);
            subscribeDOM(this.menuNode, 'done-clicked', () => this._onDidEnd.fire(), this, this.subscriptions);
        }
        return this.menuNode;
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}
