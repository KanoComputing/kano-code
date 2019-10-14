import {
    Blockly,
    utils,
    goog,
    Field,
} from '@kano/kwc-blockly/blockly.js';
import '@kano/styles/color.js';
import '@kano/styles/typography.js';
import { subscribeDOM } from '@kano/common/index.js';
import '../../../elements/kc-quote-picker.js';
import { IItemData } from './stamps-field.js';
import { KCQuotePicker } from '../../../elements/kc-quote-picker.js';

export class FieldPicker extends Field {
    private domNode: KCQuotePicker | null = null;
    private items: IItemData[];
    constructor(value: string, items: IItemData[], optValidator?: () => void) {
        super(value, optValidator);
        this.items = items;
    }

    showEditor_() {
        if (!this.domNode) {
            this.domNode = document.createElement('kc-quote-picker') as KCQuotePicker;
            this.domNode.style.border = '2px solid var(--kc-border-color)';
            this.domNode.style.borderRadius = '6px';
            this.domNode.style.overflow = 'hidden';
            this.domNode.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.15)';
            this.domNode.items = this.items.map((set) => {
                return {
                    id: set.id,
                    label: set.label,
                    items: set.resources.map(item => ({
                        id: item.id,
                        label: item.label,
                    })),
                };
            });
            subscribeDOM(this.domNode, 'value-changed', (e : CustomEvent) => {
                this.setValue(e.detail.label);
            });
        }
        Blockly.WidgetDiv.show(
            this,
            this.sourceBlock_.RTL,
            FieldPicker.widgetDispose_,
        );
        const div = Blockly.WidgetDiv.DIV;
        div.appendChild(this.domNode);
        this.domNode.value = this.getValue();
        const item = this.getItemForValue(this.domNode.value);
        if (item && item.id) {
            this.domNode.id = item.id;
        }
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

    getItemForValue(value : string) {
        for (let i = 0; i < this.items.length; i += 1) {
            const found = this.items[i].resources.find(s => s.label === value);
            if (found) {
                return found;
            }
        }
        return null;
    }

    getOptions() {
        return this.items;
    }

    static widgetDispose_() { }
}
