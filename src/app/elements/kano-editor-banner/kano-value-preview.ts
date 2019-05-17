import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { customElement } from 'lit-element/lit-element.js';

const HEX_COLOR_REGEXP = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/;

const template = html`
    <style>
        :host {
            display: inline-block;
            vertical-align: middle;
        }
        :host .color-value {
            border-radius: 3px;
            border: 1px solid rgba(0, 0, 0, 0.55);
            width: 24px;
            height: 18px;
        }
        :host #input {
            border-radius: 3px;
            color: black;
            background: var(--kano-value-preview-input-background, rgba(255, 255, 255, 0.7));
            padding: 2px 6px;
            line-height: 1;
        }
        [hidden] {
            display: none !important;
        }
    </style>
    <div id="display">
        <div id="input">
            <slot></slot>
        </div>
    </div>
`;

@customElement('kano-value-preview')
export class KCValuePreview extends HTMLElement {
    public type : string|null = null;
    connectedCallback() {
        if (this.getAttribute('type')) {
            this.type = this.getAttribute('type');
        }
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
        this._render();
    }
    _render() {
        let value = this.textContent!;
        if (HEX_COLOR_REGEXP.exec(value)) {
            this.type = 'color-value';
            const display = this.shadowRoot!.querySelector('#display') as HTMLElement;
            const input = this.shadowRoot!.querySelector('#input') as HTMLElement;
            display.classList.add(this.type);
            display.style.backgroundColor = value;
            input.innerHTML = '';
            input.setAttribute('hidden', '');
        } else {
            this.type = 'simple-value';
        }
    }
}
