import { PartInlineDisplay } from '../../inline-display.js';
import { ButtonPart } from './button.js';
import { Flash } from '../../../plugins/flash.js';

export class ButtonInlineDisplay extends PartInlineDisplay<HTMLDivElement> {
    public domNode: HTMLDivElement;
    private flash : Flash = new Flash();
    constructor(part : ButtonPart) {
        super(part);
        this.domNode = this.flash.domNode;
        this.domNode.style.marginRight = '8px';
        part.core.click.event(() => {
            this.flash.trigger();
        });
    }
    onInject() {}
}
