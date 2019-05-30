import { Blockly, utils, goog, Field } from '@kano/kwc-blockly/blockly.js';
import '@kano/styles/color.js';
import '@kano/styles/typography.js';
import '../components/kc-sample-picker.js';
import { subscribeDOM } from '@kano/common/index.js';
import { KCSamplePicker } from '../components/kc-sample-picker.js';

interface IItemData {
    id : string;
    label : string;
    samples : { id : string, src : string, label : string }[];
}

export class FieldSample extends Field {
    private domNode : KCSamplePicker|null = null;
    private items : IItemData[];
    constructor(value : string, items : IItemData[], optValidator? : () => void) {
        super(value, optValidator);
        this.items = items;
    }
    showEditor_() {
        if (!this.domNode) {
            this.domNode = document.createElement('kc-sample-picker') as KCSamplePicker;
            this.domNode.style.border = '2px solid var(--kc-border-color)';
            this.domNode.style.borderRadius = '6px';
            this.domNode.style.overflow = 'hidden';
            this.domNode.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.15)';
            this.domNode.items = this.items.map((set) => {
                return {
                    id: set.id,
                    label: set.label,
                    items: set.samples.map((sample) => ({ id: sample.id, label: sample.label, image: sample.src })),
                };
            });
            subscribeDOM(this.domNode, 'value-changed', (e : CustomEvent) => {
                this.setValue(e.detail);
            });
        }
        Blockly.WidgetDiv.show(
            this,
            this.sourceBlock_.RTL,
            FieldSample.widgetDispose_,
        );
        const div = Blockly.WidgetDiv.DIV;
        div.appendChild(this.domNode);
        this.domNode.value = this.getValue();
        this.position();
        if ('animate' in HTMLElement.prototype) {
            div.animate({
                opacity: [0, 1],
            }, {
                duration: 100,
                easing: 'ease-out',
            });
        }
        setTimeout(() => {
            if (!this.domNode) {
                return;
            }
            this.domNode.revealSelectedElement();
        });
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
