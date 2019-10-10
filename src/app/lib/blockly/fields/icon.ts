import { Field, utils, Blockly } from '@kano/kwc-blockly/blockly.js';

export abstract class FieldIcon extends Field {
    private spacing: number = 6;
    private sizeParams: { width: number, height: number, padding: [number, number, number, number] };
    private textHide: boolean = false;
    private legacyIdMap: Map<string, string>;
    protected imageElement_: SVGElement | null = null;
    protected textElement_: SVGTextElement | null = null;
    constructor(value: string, optValidator?: () => void) {
        super(null, optValidator);
        this.sizeParams = {
            width: 14,
            height: 14,
            padding: [6, 6, 6, 6],
        };
        // External size used by blockly to layout the field in the block
        this.size_.height = this.sizeParams.height;
        this.legacyIdMap = new Map();
        this.setValue(value);
    }
    init() {
        if (this.fieldGroup_) {
            // Image has already been initialized once.
            return;
        }
        if (this.textHide) {
            this.size_.width = this.sizeParams.width;
            this.size_.height = this.sizeParams.height;
        }
        // Build the DOM.
        this.fieldGroup_ = utils.createSvgElement('g', {
            class: 'blocklyEditableText',
        }, null);
        this.borderRect_ = utils.createSvgElement('rect', {
            rx: 4,
            ry: 4,
            x: -(this.sizeParams.padding[0]),
            y: -(this.sizeParams.padding[0]),
            width: this.size_.width + this.sizeParams.padding[1] + this.sizeParams.padding[3],
            height: this.size_.height + this.sizeParams.padding[0] + this.sizeParams.padding[2],
        }, this.fieldGroup_);
        this.imageElement_ = utils.createSvgElement(
            'image',
            {
                height: this.sizeParams.height + 'px',
                width: this.sizeParams.width + 'px'
            },
            this.fieldGroup_);
        this.textElement_ = utils.createSvgElement('text', {
            class: 'blocklyText',
            x: this.sizeParams.width + this.spacing,
            y: this.size_.height - 12.5,
        }, this.fieldGroup_) as SVGTextElement;
        this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
        Blockly.bindEvent_(this.fieldGroup_, 'mousedown', this, this._onMouseDown);
        this.render_();
    }
    render_() {
        if (!this.visible_ || !this.textElement_ || !this.imageElement_) {
            this.size_.width = 0;
            return;
        }
        this.legacyValueCheck(this.getValue());
        const url = this.getIcon(this.getValue());
        this.textElement_.textContent = this.getDisplayText_();
        this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url || '');
        this.updateWidth();
    }
    updateWidth() {
        if (!this.textElement_) {
            return;
        }
        const url = this.getIcon(this.getValue());
        const imgWidth = url ? this.sizeParams.width + this.spacing : 0;
        const textWidth = this.textHide ? 0 : Field.getCachedWidth(this.textElement_);
        // If the display text has content but the reported width is still zero, bail out. It means the element is not attached to the tree yet
        if (this.getDisplayText_().length !== 0 && textWidth === 0) {
            return;
        }
        const width = imgWidth + textWidth;
        if (this.borderRect_) {
            this.borderRect_.setAttribute('x', (-(this.sizeParams.padding[1])).toString());
            this.borderRect_.setAttribute('width', (width + this.sizeParams.padding[1] + this.sizeParams.padding[2]).toString());
        }
        if (this.textElement_ && !this.textHide) {
            this.textElement_.setAttribute('x', imgWidth.toString());
            this.textElement_.setAttribute('y', '12.5');
        }
        this.size_.width = width;
    }
    _onMouseDown(e : any) {
        if (Blockly.WidgetDiv.isVisible()) {
            Blockly.WidgetDiv.hide();
        } else if (!this.sourceBlock_.isInFlyout) {
            this.showEditor_();
            e.preventDefault();
            e.stopPropagation();
        }
    }
    legacyValueCheck(value : string) {
        const newId = this.legacyIdMap.get(value);
        if (newId) {
            this.setValue(newId);
        }
    }
    setLegacyIdMap(map : Map<string, string>) {
        this.legacyIdMap = map;
    }
    abstract showEditor_(): void;
    abstract getIcon(id: string): string;
    abstract getLabel(): string;
}