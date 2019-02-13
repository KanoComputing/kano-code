import { LitElement, css, html, customElement, property, query } from 'lit-element/lit-element.js';

@customElement('kc-clock-display')
export class KCClockDisplay extends LitElement {
    @property({ type: String })
    private h : string = '00';
    @property({ type: String })
    private m : string = '00';
    @property({ type: String })
    private s : string = '00';
    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                color: #fff;
                margin-right: 8px;
                font-size: 12px;
            }
            .data {
                width: 18px;
                display: flex;
                flex-direction: row;
                justify-content: center;
            }
            span {
                width: 10px;
                font-size: 11px;
                text-align: center;
            }
        `;
    }
    render() {
        return html`
            <div class="data">${this.h}</div>
            <span>&nbsp;:&nbsp;</span>
            <div class="data">${this.m}</div>
            <span>&nbsp;:&nbsp;</span>
            <div class="data">${this.s}</div>
        `;
    }
    _leftPadTime(n : number) : string{
        return n < 10 ? '0' + n : n.toString();
    }
    setTime(date : Date) {
        this.h = this._leftPadTime(date.getHours()),
        this.m = this._leftPadTime(date.getMinutes()),
        this.s = this._leftPadTime(date.getSeconds());
    }
}
