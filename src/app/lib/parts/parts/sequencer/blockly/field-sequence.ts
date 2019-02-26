import { Field, BlockSvg, goog, utils } from '@kano/kwc-blockly/blockly.js';
import { EventEmitter, IDisposable, subscribeDOM } from '@kano/common/index.js';

let id = 0;

const map = new Map();

let added = false;

export type ISequenceConfig = boolean[];

const REVERSE_PADDING_X = 8;
const REVERSE_PADDING_Y = 5;

const cellPool : SVGRectElement[] = [];

export class FieldSequence extends Field {
    private _size : number = 8;
    private _steps : boolean[];
    private _stepWidth : number;
    public __id : string;
    private dot? : SVGCircleElement;
    private _onDidChangeSteps : EventEmitter<ISequenceConfig> = new EventEmitter();
    private cells : SVGRectElement[] = [];
    private wrapRect? : SVGRectElement;
    private listeners : WeakMap<SVGRectElement, IDisposable> = new WeakMap();
    static getCell() : SVGRectElement {
        if (!cellPool.length) {
            return utils.createSvgElement<SVGRectElement>('rect', {
                height: 18,
                rx: 2,
                ry: 2,
                y: 4 - REVERSE_PADDING_Y,
                class: 'blocklyFieldStepPad',
            });
        }
        return cellPool.pop()!;
    }
    get onDidChangeSteps() { return this._onDidChangeSteps.event; }
    constructor(size : number, opt_validator? : () => void) {
        super(null, opt_validator);
        this._size = size;
        this._stepWidth = this._size > 8 ? 12 : 18;
        this._steps = new Array(this._size);
        this._steps.fill(false);
        this.width_ = this._size * (this._stepWidth + 3) + 6;
        this.height_ = 26;
        this.size_ = new goog.math.Size(this.width_ - REVERSE_PADDING_X * 2, this.height_ - REVERSE_PADDING_Y * 2);
        this.__id = id.toString();
        id += 1;
        map.set(this.__id, this);
    }
    static get map() { return map; }
    getSteps() : ISequenceConfig {
        return this._steps;
    }
    setSteps(config : ISequenceConfig) {
        const oldSize = this._size;
        this._steps = config;
        this._size = config.length;
        if (oldSize !== this._size) {
            this.renderSteps();
            this.forceRerender();
        } else {
            this.render_();
        }
    }
    setSize(size : number) {
        const newArray = [];
        for (let i = 0; i < size; i += 1) {
            newArray.push(this._steps[i] || false);
        }
        this.setSteps(newArray);
        this._onDidChangeSteps.fire(this._steps);
    }
    renderSteps() {
        if (!this.fieldGroup_) {
            return;
        }
        // Recycle the cells and empty the current array
        this.cells.forEach((cell) => {
            cellPool.push(cell);
            this.fieldGroup_!.removeChild(cell);
            const listener = this.listeners.get(cell);
            if (listener) {
                listener.dispose();
            }
        });
        this.cells.length = 0;
        for (let i = 0; i < this._size; i++) {
            const step = FieldSequence.getCell();
            step.setAttribute('width', this._stepWidth.toString());
            step.setAttribute('x', (i * (this._stepWidth + 3) + 4 - REVERSE_PADDING_X).toString());
            this.fieldGroup_.appendChild(step);
            this.cells.push(step);
            // Closure to keep the value of the index
            ((stepIndex) => {
                const listener = subscribeDOM(step, 'mousedown', () => {
                    this._steps[stepIndex] = !this._steps[stepIndex];
                    this._onDidChangeSteps.fire(this._steps);
                    this.render_();
                });
                // Store listener with element. This allows us to stop listening later on
                this.listeners.set(step, listener);
            })(i);
        }
        if (this.dot) {
            this.fieldGroup_.appendChild(this.dot);
        }
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
        this.fieldGroup_ = utils.createSvgElement<SVGGElement>('g', {
            transform: 'translate(-4, -4)',
        }, null);
        // Rectangle used as a styled border for the cells
        this.wrapRect = utils.createSvgElement<SVGRectElement>('rect', {
            x: -REVERSE_PADDING_X,
            y: -REVERSE_PADDING_Y,
            width: this.width_,
            height: 26,
            rx: 3,
            ry: 3,
            class: 'blocklyFieldStep',
        }, this.fieldGroup_);
    
        if (!this.visible_) {
            this.fieldGroup_.style.display = 'none';
        }
    
        this.renderSteps();
    
        // Render the moving dot over the cells
        this.dot = utils.createSvgElement<SVGCircleElement>('circle', {
            cx: 13 - REVERSE_PADDING_X,
            cy: 13 - REVERSE_PADDING_Y,
            r: 4,
            class: 'blocklyFieldStepDot',
        }, this.fieldGroup_);
    
        // Add itself to the block tree
        this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
        this.render_();
    }
    render_() {
        // Update width values for Blockly's layouting
        this._stepWidth = this._size > 8 ? 12 : 18;
        this.width_ = this._size * (this._stepWidth + 3) + 6;
        // Update the selected state of all cells
        this.cells.forEach((cell, index) => {
            if (this._steps[index]) {
                utils.addClass(cell, 'selected');
            } else {
                utils.removeClass(cell, 'selected');
            }
            // Update width and x position in case we switched between full and narrow cell
            cell.setAttribute('width', this._stepWidth.toString());
            cell.setAttribute('x', (index * (this._stepWidth + 3) + 4 - REVERSE_PADDING_X).toString());
        });
        // Update the width of the wrapping rectangle
        if (this.wrapRect) {
            this.wrapRect.setAttribute('width', this.width_.toString());
        }
        // This is read by the block to compute its overall size for rendering
        this.size_.width = this.width_ - REVERSE_PADDING_X * 2;
    }
    setValue() {}
    getValue() {
        return this.__id;
    }
    setCurrentStep(index : number) {
        if (!this.dot) {
            return;
        }
        this.dot.setAttribute('cx', (index * (this._stepWidth + 3) + 4 + (this._stepWidth / 2) - REVERSE_PADDING_X).toString());
    }
    dispose() {
        super.dispose();
        this._onDidChangeSteps.dispose();
        this.cells.length = 0;
    }
}
