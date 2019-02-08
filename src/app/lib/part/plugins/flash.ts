import { subscribeTimeout, IDisposable } from '@kano/common/index.js';
import { Field, goog, BlockSvg, utils, Block } from '@kano/kwc-blockly/blockly.js';
import { flash } from '../icons.js';
import { IEditor } from '../editor.js';
import { Part } from '../part.js';
import { BlocklySourceEditor } from '../../editor/source-editor/blockly.js';

export class FlashField extends Field  {
    private fieldGroup_? : SVGElement;
    private path? : SVGElement;
    constructor(text : string) {
        super();
        this.height_ = 16;
        this.width_ = 16;
        this.size_ = new goog.math.Size(this.width_, this.height_ + 2 * BlockSvg.INLINE_PADDING_Y);
        this.text_ = text || '';
        this.tooltip_ = '';
    }
    init() {
        if (this.fieldGroup_) {
            // Image has already been initialized once.
            return;
          }
          // Build the DOM.
          this.fieldGroup_ = utils.createSvgElement('g', {}, null);
          const instance = flash.content.cloneNode(true) as DocumentFragment;
          this.path = instance.querySelector('polygon') as SVGElement;
          this.path.style.transform = `scale(${this.width_ / 40}, ${this.height_ / 40})`;
          this.path.style.fill = 'yellow';
          this.path.style.opacity = '0.3';
          this.fieldGroup_.appendChild(this.path);
          this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
    }
    render_() {}
    trigger() {
        if (!this.path) {
            return;
        }
        this.path.style.opacity = '1';
        setTimeout(() => {
            if (!this.path) {
                return;
            }
            this.path.style.opacity = '0.3';
        }, 500);
    }
}

export class Flash {
    public domNode: HTMLDivElement = document.createElement('div');
    private timeoutSub : IDisposable|null = null;
    constructor() {
        this.domNode.style.display = 'flex';
        this.domNode.style.fill = '#8F9195';
        this.domNode.style.flexDirection = 'row';
        this.domNode.style.justifyContent = 'flex-end';
        this.domNode.appendChild(flash.content.cloneNode(true));
        const icon = this.domNode.querySelector('svg');
        icon!.style.width = '14px';
        icon!.style.height = '14px';
    }
    trigger() {
        if (this.timeoutSub) {
            this.timeoutSub.dispose();
            this.timeoutSub = null;
        }
        this.domNode.style.fill = 'yellow';
        this.timeoutSub = subscribeTimeout(() => {
            this.domNode.style.fill = '#8F9195';
        }, 500);
    }
}

export function addFlashField(block : Block) {
    block.inputList[0].insertFieldAt(0, new FlashField(''), 'FLASH');
}

export function setupFlash<T extends Part>(editor : IEditor, part : T, method : keyof T) {
    if (editor.sourceType !== 'blockly') {
        return;
    }
    const sourceEditor = editor.sourceEditor as BlocklySourceEditor;
    const workspace = sourceEditor.getWorkspace();
    // Trust that the key provided is for an event method
    const fn = part[method] as unknown as (cb : () => void) => void;
    fn.bind(part)(() => {
        const blocks = workspace.getAllBlocks();
        blocks.filter((block) => block.type === `${part.id}_${method}`)
            .forEach((block) => {
                const field = block.getField('FLASH') as FlashField;
                field.trigger();
            });
    });
}
