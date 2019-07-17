import { Blockly, utils, goog } from '@kano/kwc-blockly/blockly.js';
import { FieldIcon } from './icon.js';
import '@kano/styles/color.js';
import '@kano/styles/typography.js';
import '../../../elements/kc-indexed-picker.js';
import { KCIndexedPicker } from '../../../elements/kc-indexed-picker.js';
import { subscribeDOM } from '@kano/common/index.js';

interface IItemData {
    id : string;
    label : string;
    stickers : { id : string, src : string }[];
}

export class StampsField extends FieldIcon {
    private domNode : KCIndexedPicker|null = null;
    private items : IItemData[];
    constructor(value : string, items : IItemData[], optValidator? : () => void) {
        super(value, optValidator);
        this.items = items;
    }
    showEditor_() {
        if (!this.domNode) {
            this.domNode = document.createElement('kc-indexed-picker') as KCIndexedPicker;
            this.domNode.style.border = '2px solid var(--kc-border-color)';
            this.domNode.style.borderRadius = '6px';
            this.domNode.style.overflow = 'hidden';
            this.domNode.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.15)';
            this.domNode.items = this.items.map((set) => {
                return {
                    id: set.id,
                    label: set.label,
                    items: set.stickers.map((sticker) => ({ id: sticker.id, label: sticker.id, image: sticker.src })),
                };
            });
            subscribeDOM(this.domNode, 'value-changed', (e : CustomEvent) => {
                this.setValue(e.detail);
            });
        }
        Blockly.WidgetDiv.show(
            this,
            this.sourceBlock_.RTL,
            StampsField.widgetDispose_,
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
    getItemForValue(value : string) : { id : string, src : string }|null {
        for (let i = 0; i < this.items.length; i += 1) {
            const found = this.items[i].stickers.find(s => s.id === value);
            if (found) {
                return found;
            }
        }
        return null;
    }
    getIcon(value : string) {
        const item = this.getItemForValue(value);
        if (item) {
            return item.src;
        }
        return '';
    }
    static widgetDispose_() {}
}
