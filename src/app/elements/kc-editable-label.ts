import { LitElement, customElement, html, property } from 'lit-element/lit-element.js';

@customElement('kc-editable-label')
export class KCEditableLabel extends LitElement {
    @property({ type: Boolean })
    public editing : boolean = false;
    @property({ type: String })
    public label : string = '';
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
        if (e.keyCode === 13 || e.keyCode === 27) {
            this.input!.blur();
        }
    }
    _onInputBlur() {
        this.apply();
    }
    apply() {
        const value = this.input!.value;
        this.editing = false;
        this.label = value;
        this.dispatchEvent(new CustomEvent('change', { detail: value }));
    }
}
