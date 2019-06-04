import { Field, goog, BlockSvg, utils } from '@kano/kwc-blockly/blockly.js';
import { throttle } from '../../decorators.js';
import { IDisposable, subscribeTimeout } from '@kano/common/index.js';
import { flash } from './icons.js';

export class FlashField extends Field  {
    private path? : SVGElement;
    private timeoutSub : IDisposable|null = null;
    static get EDITABLE() { return false; }
    constructor(text : string) {
        super(text);
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
    @throttle(50)
    trigger() {
        if (!this.path) {
            return;
        }
        if (this.timeoutSub) {
            this.timeoutSub.dispose();
            this.timeoutSub = null;
        }
        this.path.style.opacity = '0.3';
        setTimeout(() => {
            this.path!.style.opacity = '1';
            this.timeoutSub = subscribeTimeout(() => {
                this.path!.style.opacity = '0.3';
            }, 500);
        }, 50);
    }
}