import { Blockly, utils, goog } from '@kano/kwc-blockly/blockly.js';
import { FieldIcon } from '../../../blockly/fields/icon.js';
import '@kano/styles/color.js';
import '@kano/styles/typography.js';
import '@kano/kwc-picker/kwc-picker.js';
import { subscribeDOM } from '@kano/common/index.js';
import { _ } from '../../../i18n/index.js';

export interface IItemData {
    id : string;
    label : string;
}

type ItemDataProvider = () => IItemData[];

export class CollidableField extends FieldIcon {
    private domNode : HTMLElement|null = null;
    private items : ItemDataProvider;
    constructor(value : string, items : ItemDataProvider, optValidator? : () => void) {
        super(value, optValidator);
        this.items = items;
    }
    refresh() {
        const items = this.items();
        if (this.domNode) {
            (this.domNode as any).items = items;
        }
        const value = this.getValue();
        if (value === '' && items.length > 0) {
            this.setValue(items[0].id);
        }
    }
    showEditor_() {
        if (!this.domNode) {
            this.domNode = document.createElement('kwc-picker');
            (this.domNode as any).name = _('COLLIDABLE_PARTS', 'Parts');
            this.domNode.style.border = '2px solid var(--kc-border-color)';
            this.domNode.style.borderRadius = '6px';
            this.domNode.style.overflow = 'hidden';
            this.domNode.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.15)';
            subscribeDOM(this.domNode, 'selected-changed', (e : CustomEvent) => {
                this.setValue(e.detail.value.id);
            });
        }
        this.refresh();
        Blockly.WidgetDiv.show(
            this,
            this.sourceBlock_.RTL,
            CollidableField.widgetDispose_,
        );
        const div = Blockly.WidgetDiv.DIV;
        div.appendChild(this.domNode);
        (this.domNode as any).value = this.getValue();
        this.position();
        if ('animate' in HTMLElement.prototype) {
            div.animate({
                opacity: [0, 1],
            }, {
                duration: 100,
                easing: 'ease-out',
            });
        }
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
    getIcon() {
        return '';
    }
    static widgetDispose_() {}
}
