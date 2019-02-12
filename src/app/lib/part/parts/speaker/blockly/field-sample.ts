import { Field, Blockly, utils, goog } from '@kano/kwc-blockly/blockly.js';
import { ISampleSet } from '../data';
import { html, render } from 'lit-html/lit-html.js';

function getTemplate(items : ISampleSet[], callback : (id : string) => any) {
    return html`
        ${items.map((set) => html`
            <div>${set.label}</div>
            <div>
                ${set.samples.map((sample) => html`
                    <button @click=${() => callback(sample.id)}>${sample.label}</button>
                `)}
            </div>
        `)}
    `;
}

export class FieldSample extends Field {
    private items : ISampleSet[];
    private domNode : HTMLDivElement = document.createElement('div');
    constructor(value : string, items : ISampleSet[], optValidator? : () => void) {
        super(null, optValidator);
        this.items = items;
        this.setValue(value);
    }
    showEditor_() {
        Blockly.WidgetDiv.show(
            this,
            this.sourceBlock_.RTL,
            FieldSample.widgetDispose_,
        );
        const div = Blockly.WidgetDiv.DIV;
        this.domNode.style.background = 'white';
        render(getTemplate(this.items, (id) => {
            this.setValue(id);
        }), this.domNode);
        div.appendChild(this.domNode);
        this.position();
    }
    position() {
        const viewportBBox = utils.getViewportBBox();
        const anchorBBox = this.getScaledBBox_();
        const elementSize = goog.style.getSize(this.domNode);
        Blockly.WidgetDiv.positionWithAnchor(
            viewportBBox,
            anchorBBox,
            elementSize,
            this.sourceBlock_.RTL,
        );
    }
    static widgetDispose_() {}
}
