import { PartInlineDisplay } from '../../inline-display.js';
import { SliderPart } from './slider.js';
import { Flash } from '../../../plugins/flash/flash.js';

export class SliderInlineDisplay extends PartInlineDisplay<HTMLDivElement> {
    public domNode: HTMLDivElement;
    private flash : Flash = new Flash();
    constructor(part : SliderPart) {
        super(part);
        this.domNode = this.flash.domNode;
        this.domNode.style.marginRight = '8px';
        part.core.changed.event(() => {
            this.flash.trigger();
        });
    }
    onInject() {}
}
