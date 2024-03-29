/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { LitElement, customElement, html, property, css, CSSResultArray } from 'lit-element/lit-element.js';

@customElement('kc-editable-label')
export class KCEditableLabel extends LitElement {
    @property({ type: Boolean })
    public editing : boolean = false;
    @property({ type: Boolean })
    public singleline : boolean = false;
    @property({ type: String })
    public label : string = '';
    static get styles() : CSSResultArray {
        return [css`
            label, input {
                font-weight: inherit;
            }
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
            label {
                width: var(--editable-label-width, auto);
            }
            label.single-line {
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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
        const additionalClass = this.singleline ? 'single-line' : '';
        return html`<label class="${additionalClass}" @click=${this._onLabelClick}>${this.label}</label>`;
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
        const value = this.input!.value;
        this.editing = false;
        if (value !== this.label) {
            this.label = value;
            this.dispatchEvent(new CustomEvent('change', { detail: value, bubbles: true, composed: true }));
        }
    }
}
