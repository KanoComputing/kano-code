import { Blockly, utils, goog } from '@kano/kwc-blockly/blockly.js';
import { FieldIcon } from './icon.js';
import '@kano/styles/color.js';
import '@kano/styles/typography.js';
import '../../../elements/kc-indexed-picker.js';
import { KCIndexedPicker } from '../../../elements/kc-indexed-picker.js';
import { subscribeDOM } from '@kano/common/index.js';
import { FieldWithLabelMixin } from './field-with-label-mixin.js';


export interface IItemDataResource {
    id : string;
    label : string;
    src : string;
}

export interface IItemData {
    id : string;
    label : string;
    resources: IItemDataResource[];
}

export class StampsField extends FieldWithLabelMixin(FieldIcon) {
    private domNode : KCIndexedPicker|null = null;
    private items : IItemData[];
    // private label : string = '';
    constructor(value : string, items : IItemData[], optValidator? : () => void, legacyIds? : Map<string, string>) {
        super(value, optValidator);
        this.items = items;
        if (legacyIds) {
            this.setLegacyIdMap(legacyIds);
        }
    }
    
    render_() {
        this.legacyValueCheck(this.getValue());
        this.label = this.getLabelFromValue(this.getValue());
        super.render_();
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
                    items: set.resources.map((sticker) => ({ id: sticker.id, label: sticker.label, image: sticker.src })),
                };
            });
            subscribeDOM(this.domNode, 'value-changed', (e : CustomEvent) => {
                this.setLabel(e.detail.label);
                this.setValue(e.detail.id);
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
    getIcon(value : string) {
        const item = this.getItemForValue(value);
        if (item) {
            return item.src;
        }
        return '';
    }
    getDisplayText_() {
        return this.getLabel();
    }
    getOptions() {
        return this.items;
    }
    static widgetDispose_() {}
}
