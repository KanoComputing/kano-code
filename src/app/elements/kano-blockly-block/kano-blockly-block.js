import '@polymer/polymer/polymer-legacy.js';
import '@kano/kwc-blockly/kwc-blockly-style.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style>
            :host {
                display: block;
                pointer-events: none;
            }
            svg path.blocklyPathDark, svg path.blocklyPathLight {
                display: none;
            }
            svg text.blocklyText {
                fill: white;
            }
            svg g.blocklyEditableText {
                fill: white;
                fill-opacity: 0.6;
            }
            svg .blocklyEditableText text.blocklyText {
                fill: black;
                font-size: 16px;
            }
        </style>
        <svg xmlns="http://www.w3.org/2000/svg" id="svg"></svg>
`,

    is: 'kano-blockly-block',

    properties: {
        type: {
            type: String,
            observer: '_typeChanged',
        },
    },

    _createWorskspace() {
        this.ws = new Blockly.WorkspaceSvg({});
        this.ws.isFlyout = true;
        this.wsDom = this.ws.createDom();
        this.transform('translate(10px, 0px)', this.wsDom);
        this.$.svg.appendChild(this.wsDom);
    },

    _typeChanged(type) {
        if (!this.ws) {
            this._createWorskspace();
        }
        let extraArgs = '';
        const xml = Blockly.Xml.textToDom(`<xml><block type="${type}" ${extraArgs}></block></xml>`);
        this.ws.clear();
        this.ws.scale = 0.9;
        this.async(() => {
            try {
                Blockly.Xml.domToWorkspace(xml, this.ws);
            } catch (e) {} // Ignore loading errors
            this._updateSvgSize();
        });
    },

    _updateSvgSize() {
        const rect = this.wsDom.getBoundingClientRect();
        this.$.svg.style.width = `${rect.width + 10}px`;
        this.$.svg.style.height = `${rect.height}px`;
    },

    getBlock() {
        return this.ws.getAllBlocks()[0];
    },

    detached() {
        if (this.ws) {
            this.ws.dispose();
        }
    },
});
