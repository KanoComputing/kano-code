import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { TerminalMixin } from './terminal.js';

class KanoPartTerminal extends TerminalMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-part-terminal'; }
    static get template() {
        return html`
            <style>
                :host {
                    display: flex;
flex-direction: column;
                    width: calc(100% + 2px);
                    height: calc(100% + 2px);
                    overflow: hidden;
                    transform: translate(-1px, -1px);
                }
                #container {
                    flex: 1;
flex-basis: 0.000000001px;
                    background: rgba(0, 0, 0, 0.9);
                    color: green;
                    font-family: monospace;
                    overflow: hidden;
                    padding: 2px 4px;
                    font-size: 18px;
                    word-wrap: break-word;
                }
            </style>
            <div id="container"></div>
        `;
    }
    applyTransform() {
        if (!this.model) {
            return;
        }
        this.style.visibility = this.model.visible ? 'visible' : 'hidden';
    }
    toggle(value) {
        this.set('model.visible', value);
    }
    printLine(message) {
        this.print(`${message}\n`);
    }
    print(message) {
        this.message += message;
    }
    _printStack() {
        let lines,
            root;
        if (this.message === '') {
            return;
        }
        lines = this.message.split('\n');
        root = this.$.container;
        if (!this.lastLine) {
            this.lastLine = document.createElement('div');
            root.appendChild(this.lastLine);
        }
        lines.forEach((line, index) => {
            if (index === 0) {
                this.lastLine.innerText = this.lastLine.innerText + line;
                return;
            }
            const div = document.createElement('div');
            div.innerText = line;
            root.appendChild(div);
        });
        while (root.children.length > 30) {
            root.removeChild(root.firstChild);
        }
        root.scrollTop = root.scrollHeight;
        this.lastLine = root.lastChild;
        this.message = '';
    }
    clear() {
        const root = this.$.container;
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        this.lastLine = null;
        this.message = '';
    }
    _stopRendering() {
        clearInterval(this._renderingInterval);
    }
    _startRendering() {
        this._stopRendering();
        // Only do a real print at 20 fps. This will bulk all the DOM writes
        // that happens really fast
        this._renderingInterval = setInterval(this._printStack.bind(this), 1000 / 20);
    }
    start(...args) {
        super.start(...args);
        this.clear();
        this._startRendering();
    }
    stop(...args) {
        super.stop(...args);
        this._stopRendering();
    }
}

customElements.define(KanoPartTerminal.is, KanoPartTerminal);