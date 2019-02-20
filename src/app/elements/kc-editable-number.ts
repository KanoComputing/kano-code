import { LitElement, customElement, html, property, css, query } from 'lit-element/lit-element.js';
import { subscribeDOM } from '@kano/common/index.js';

@customElement('kc-editable-number')
export class KcEditableNumber extends LitElement {
    @property({ type: Number })
    public value : number = 0;

    @property({ type: Boolean })
    protected editing : boolean = false;

    @query('input')
    protected inputEl? : HTMLInputElement;

    @query('label')
    protected labelEl? : HTMLLabelElement;
    
    static get styles() {
        return [css`
            label {
                cursor: col-resize;
                user-select: none;
                color: #1565c0;
                text-decoration: underline;
            }
            input {
                text-align: right;
                font-family: inherit;
                font-size: inherit;
                background: transparent;
                color: white;
                border: 1px solid grey;
                outline: none;
                padding: 2px;
                margin: -3px;
            }
            input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            input[type="number"] {
                -moz-appearance: textfield;
            }
        `];
    }
    render() {
        return html`
            ${this.editing ? this.renderInput() : this.renderLabel()}
        `;
    }
    renderLabel() {
        return html`<label @mousedown=${this.onMouseDown}>${this.value.toFixed(2)}</label>`;
    }
    renderInput() {
        return html`<input type="number" .value=${this.value.toFixed(2)} @keydown=${this._onInputKeyDown} @blur=${this._onInputBlur} />`;
    }
    onMouseDown(e : MouseEvent) {
        const start = e.x;
        let lastValue = start;
        const moveSub = subscribeDOM(document as unknown as HTMLElement, 'mousemove', (e : MouseEvent) => {
            const delta = e.x - lastValue;
            let step = 1;
            if (e.shiftKey) {
                step = 5;
            } else if (e.ctrlKey) {
                step = 0.1;
            }
            this.value += delta * step;
            lastValue = e.x;
            this.dispatchEvent(new CustomEvent('input', { detail: this.value, bubbles: true, composed: true }));
        });
        const upSub = subscribeDOM(document as unknown as HTMLElement, 'mouseup', () => {
            moveSub.dispose();
            upSub.dispose();
            if (lastValue === start) {
                this._onClick();
            } else {
                this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
            }
        });
    }
    _onClick() {
        this.editing = true;
        this.updateComplete.then(() => {
            const input = this.inputEl!;
            input.select();
        });
    }
    _onInputKeyDown(e : KeyboardEvent) {
        if (e.keyCode === 27) {
            this.cancel();
        }
        if (e.keyCode === 13) {
            this.apply();
        }
    }
    _onInputBlur() {
        this.apply();
    }
    cancel() {
        this.editing = false;
    }
    apply() {
        const value = parseFloat(this.inputEl!.value);
        this.editing = false;
        if (value !== this.value) {
            this.value = value;
            this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
        }
    }
}