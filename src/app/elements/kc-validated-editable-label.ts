import { KCEditableLabel } from './kc-editable-label.js';
import { property, customElement, html, css } from 'lit-element/lit-element.js';

@customElement('kc-validated-editable-label')
export class KCValidatedEditableLabel extends KCEditableLabel {
    @property({ type: Function })
    validator : (oldValue : string, newValue : string) => string|boolean = () => true;
    @property({ type: String })
    private errorMessage : string = '';
    static get styles() {
        return [css`
            :host {
                position: relative;
            }
            .error-message {
                position: absolute;
                border: 1px solid grey;
                top: calc(100% + 2px);
                left: -3px;
                padding: 2px 4px;
                background: rgba(0, 0, 0, 0.25);
            }
        `, ...super.styles];
    }
    get inputEl() {
        return html`
            ${super.inputEl}
            ${this.errorMessage.length ? this.errorEl : ''}
        `;
    }
    get errorEl() {
        return html`<div class="error-message">${this.errorMessage}</div>`;
    }
    apply() {
        const input = this.input!
        const value = input.value;
        const validation = this.validator(this.label, value)
        if (validation === true) {
            return super.apply();
        }
        input.style.borderColor = 'red';
        if (typeof validation === 'string') {
            this.errorMessage = validation;
        }
    }
    _onInputKeyDown(e : KeyboardEvent) {
        if (this.errorMessage.length) {
            this.errorMessage = '';
        }
        this.input!.style.borderColor = '';
        super._onInputKeyDown(e);
    }
}
