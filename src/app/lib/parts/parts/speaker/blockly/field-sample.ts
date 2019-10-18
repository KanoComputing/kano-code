import { Blockly, utils, goog, Field } from '@kano/kwc-blockly/blockly.js';
import '@kano/styles/color.js';
import '@kano/styles/typography.js';
import '../components/kc-sample-picker.js';
import { subscribeDOM } from '@kano/common/index.js';
import { KCSamplePicker } from '../components/kc-sample-picker.js';
import { IItemDataResource, IItemData } from '../../../../blockly/fields/stamps-field.js';

export class FieldSample extends Field {
    private domNode : KCSamplePicker|null = null;
    private legacyIdMap: Map<string, string>;
    private label: string = '';
    private items: IItemData[];
    constructor(value : string, items : IItemData[], legacyIdMap : Map<string, string>, optValidator? : () => void) {
        super(value, optValidator);
        this.items = items;
        this.legacyIdMap = legacyIdMap;
    }

    render_() {
        this.legacyValueCheck(this.getValue());
        this.label = this.getLabelFromValue(this.getValue());
        super.render_();
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
                    items: set.resources.map((sample) => ({ id: sample.id, label: sample.label, image: sample.src })),
                };
            });
            subscribeDOM(this.domNode, 'value-changed', (e: CustomEvent) => {
                this.setLabel(e.detail.label);
                this.setValue(e.detail.id);
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
    getDisplayText_() {
        return this.getLabel();
    }
    legacyValueCheck(value: string) {
        const newId = this.legacyIdMap.get(value);
        if (newId) {
            this.setValue(newId);
            this.setLabel(this.getLabelFromValue(newId));
        }
    }
    setLegacyIdMap(map: Map<string, string>) {
        this.legacyIdMap = map;
    }

    getOptions() {
        return this.items;
    }

    getItemForValue(value: string): { id: string, label: string, src: string } | null {
        for (let i = 0; i < this.items.length; i += 1) {
            const found = this.items[i].resources.find((s: IItemDataResource) => s.id === value);
            if (found) {
                return found;
            }
        }
        return null;
    }
    getLabelFromValue(value: string): string {
        const item = this.getItemForValue(value);
        if (item) {
            return item.label;
        }
        return '';
    }
    setLabel(label: string) {
        this.label = label;
    }
    getLabel() {
        return this.label;
    }

    static widgetDispose_() {}
}
