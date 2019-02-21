import 'prismjs/prism.js';
import { LitElement, customElement, property, css, html, query } from 'lit-element';
import { prismTheme } from './kano-prism-theme.js';

const CODE_DISPLAY_LINE_HEIGHT = 20;

@customElement('kano-code-display')
export class KanoCodeDisplay extends LitElement {
    @property({ type: String })
    public code : string = '';
    @property({ type: String })
    public lang : string = 'javascript';
    @property({ type: Number })
    public lines : number = 0;
    @query('#output')
    private outputEl? : HTMLElement;
    static get styles() {
        return [prismTheme, css`
            :host {
                box-sizing: border-box;
                padding: 8px 8px 0 0;
                display: flex;
                flex-direction: row;
            }
            :host pre {
                width: 100%;
                color: #fff;
                white-space: pre-wrap;
                padding: 0;
                margin: 0 0 0 10px;
                font-size: 14px;
                line-height: 20px;
                counter-reset: line;
            }
            :host .line-number-container {
                color: #fff;
                opacity: 0.1;
                margin-right: 8px;
                display: flex;
                flex-direction: column;
            }
            :host .line-number {
                height: 20px;
                counter-increment: line;
            }
            :host .line-number:before {
                line-height: 20px;
                font-family: var(--font-body);
                font-size: 14px;
                font-weight: bold;
                content: counter(line);
            }
        `];
    }
    render() {
        return html`
            <div class="line-number-container">
                ${this.getLines()}
            </div>
            <pre id="output"></pre>
        `;
    }
    getLines() {
        const l = [];
        for (let i = 0; i < this.lines; i += 1) {
            l.push(html`<span class="line-number"></span>`);
        }
        return l;
    }
    updated(changes : Map<string, unknown>) {
        if (changes.has('code')) {
            this._render();
        }
    }
    _render() {
        if (!this.outputEl || !this.code) {
            return;
        }
        this.outputEl.style.height = '0';
        this.outputEl.innerHTML = window.Prism.highlight(this.code, window.Prism.languages[this.lang]);
        this._computeLineNumbers();
    }
    _computeLineNumbers () {
        if (!this.outputEl) {
            return;
        }
        let codeSpaceHeight = this.outputEl.scrollHeight;
        this.lines = Math.round(codeSpaceHeight / CODE_DISPLAY_LINE_HEIGHT);
    }
}
