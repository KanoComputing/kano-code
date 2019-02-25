import { Field, BlockSvg, goog, utils } from '@kano/kwc-blockly/blockly.js';
import { EventEmitter } from '@kano/common/index.js';

let id = 0;

const map = new Map();

let added = false;

export type ISequenceConfig = boolean[];

export class FieldSequence extends Field {
    private _size : number = 8;
    private _steps : boolean[];
    private _stepWidth : number;
    private stepEls : SVGRectElement[] = [];
    public __id : string;
    private dot? : SVGCircleElement;
    private _onDidChangeSteps : EventEmitter<ISequenceConfig> = new EventEmitter();
    get onDidChangeSteps() { return this._onDidChangeSteps.event; }
    constructor(value : any, opt_validator? : () => void) {
        super(null, opt_validator);
        this._stepWidth = this._size > 8 ? 12 : 18;
        this._steps = new Array(this._size);
        this._steps.fill(false);
        this.width_ = this._size * (this._stepWidth + 3) + 6;
        this.height_ = 26 + 4 * BlockSvg.INLINE_PADDING_Y;
        this.size_ = new goog.math.Size(this.width_, this.height_);
        this.__id = id.toString();
        id += 1;
        map.set(this.__id, this);
    }
    static get map() { return map; }
    getSteps() : ISequenceConfig {
        return this._steps;
    }
    setSteps(config : ISequenceConfig) {
        this._steps = config;
        this._size = config.length;
        this.renderSteps();
    }
    renderSteps() {
        this.stepEls.forEach((step, index) => {
            if (this._steps[index]) {
                utils.addClass(step, 'selected');
            } else {
                utils.removeClass(step, 'selected');
            }
        });
    }    
    addStyles() {
        if (added || !this.sourceBlock_) {
            return;
        }
    
        const parent = this.sourceBlock_.workspace.componentRoot_;
        const style = document.createElement('style');
        style.innerHTML = `
        .blocklyFieldStep {
            cursor: initial;
            fill: #77223D;
        }
        .blocklyFieldStepPad {
            fill: pink;
            cursor: pointer;
            opacity: 0.9;
        }
        .blocklyFieldStepPad.selected {
            fill: white;
            opacity: 1;
        }
        .blocklyFieldStepPad:hover {
            opacity: 1;
        }
        .blocklyFieldStepDot {
            fill: #77223D;
        }
        `;
        if (!parent) {
            return;
        }
    
        parent.appendChild(style);
        added = true;
    }
    init() {
        if (this.fieldGroup_) {
            // Field has already been initialized once.
            return;
        }
        this.addStyles();
        // Build the DOM.
        this.fieldGroup_ = utils.createSvgElement<SVGGElement>('g', {}, null);
        utils.createSvgElement<SVGRectElement>('rect', {
            x: 0,
            y: 0,
            width: this.size_.width,
            height: 26,
            rx: 3,
            ry: 3,
            class: 'blocklyFieldStep',
        }, this.fieldGroup_);
    
        if (!this.visible_) {
            this.fieldGroup_.style.display = 'none';
        }
    
        for (let i = 0; i < this._size; i++) {
            const step = utils.createSvgElement<SVGRectElement>('rect', {
                width: this._stepWidth,
                height: 18,
                rx: 2,
                ry: 2,
                x: i * (this._stepWidth + 3) + 4,
                y: 4,
                class: 'blocklyFieldStepPad',
            }, this.fieldGroup_);
            ((stepIndex) => {
                step.addEventListener('mousedown', () => {
                    this._steps[stepIndex] = !this._steps[stepIndex];
                    this._onDidChangeSteps.fire(this._steps);
                    if (this._steps[stepIndex]) {
                        utils.addClass(step, 'selected');
                    } else {
                        utils.removeClass(step, 'selected');
                    }
                });
            })(i);
            this.stepEls.push(step);
        }
    
        this.renderSteps();
    
        this.dot = utils.createSvgElement<SVGCircleElement>('circle', {
            cx: 13,
            cy: 13,
            r: 4,
            class: 'blocklyFieldStepDot',
        }, this.fieldGroup_);
    
        this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
    }
    getScaledBBox_() {
        if (!this.fieldGroup_) {
            return new goog.math.Size(0, 0);
        }
        const bBox = (this.fieldGroup_ as any).getBBox();
        // Create new object, as getBBox can return an uneditable SVGRect in IE.
        return new goog.math.Size(
            bBox.width * this.sourceBlock_.workspace.scale,
            bBox.height * this.sourceBlock_.workspace.scale,
        );
    }
    render_() {}
    setValue() {}
    getValue() {
        return this.__id;
    }
    setSize(value : number) {
        this._size = value;
        this._stepWidth = this._size > 8 ? 12 : 18;
        this._steps = new Array(this._size);
        this._steps.fill(false);
        this.stepEls = [];
        this.width_ = this._size * (this._stepWidth + 3) + 6;
        this.height_ = 26 + 4 * BlockSvg.INLINE_PADDING_Y;
        this.size_ = new goog.math.Size(this.width_, this.height_);
        if (!this.fieldGroup_) {
            return;
        }
        if (this.fieldGroup_.parentNode) {
            this.fieldGroup_.parentNode.removeChild(this.fieldGroup_);
        }
        this.fieldGroup_ = null;
        this.init();
    }
    setCurrentStep(index : number) {
        if (!this.dot) {
            return;
        }
        this.dot.setAttribute('cx', (index * (this._stepWidth + 3) + 4 + (this._stepWidth / 2)).toString());
    }
}
