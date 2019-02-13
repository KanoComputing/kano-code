import { LitElement, customElement, html, property, css, CSSResultArray } from 'lit-element/lit-element.js';

@customElement('kc-editable-label')
export class KCEditableLabel extends LitElement {
    @property({ type: Boolean })
    public editing : boolean = false;
    @property({ type: String })
    public label : string = '';
    static get styles() : CSSResultArray {
        return [css`
            input {
                font-family: inherit;
                font-size: inherit;
                background: transparent;
                color: white;
                border: 1px solid grey;
                outline: none;
                padding: 2px;
                margin: -3px;
            }
        `];
    }
    render() {
        return html`${this.editing ? this.inputEl : this.labelEl}`;
    }
    get inputEl() {
        return html`<input type="text" .value=${this.label} @keydown=${this._onInputKeyDown} @blur=${this._onInputBlur} />`;
    }
    get labelEl() {
        return html`<label @click=${this._onLabelClick}>${this.label}</label>`;
    }
    get input() {
        return this.renderRoot!.querySelector('input');
    }
    _onLabelClick() {
        this.editing = true;
        this.updateComplete.then(() => {
            const input = this.input!;
            input.select();
        });
    }
    _onInputKeyDown(e : KeyboardEvent) {
        if (e.keyCode === 27) {
            this.input!.blur();
        }
        if (e.keyCode === 13) {
            this.apply();
        }
    }
    _onInputBlur() {
        this.cancel();
    }
    cancel() {
        this.editing = false;
    }
    apply() {
        const value = this.input!.value;
        this.editing = false;
        if (value !== this.label) {
            this.label = value;
            this.dispatchEvent(new CustomEvent('change', { detail: value, bubbles: true, composed: true }));
        }
    }
}
