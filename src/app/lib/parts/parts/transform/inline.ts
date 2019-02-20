import { PartInlineDisplay } from '../../inline-display.js';
import { KcEditableNumber } from '../../../../elements/kc-editable-number.js';
import { subscribeDOM, IDisposable } from '@kano/common/index.js';
import { DOMPart } from '../dom/dom.js';
import { Flash } from '../../../plugins/flash.js';

class Control {
    public domNode : KcEditableNumber = new KcEditableNumber();
    private subscriptions : IDisposable[] = [];
    constructor(part : DOMPart, prop : string) {
        this.domNode.style.marginRight = '8px';
        this.domNode.value = part.transform[prop];
        subscribeDOM(this.domNode, 'input', (e : CustomEvent) => {
            part.transform[prop] = e.detail;
            part.transform.invalidate();
        }, this, this.subscriptions);
        subscribeDOM(this.domNode, 'change', (e : CustomEvent) => {
            part.transform[prop] = e.detail;
            part.transform.invalidate();
        }, this, this.subscriptions);
        part.transform.onDidInvalidate(() => {
            this.domNode.value = part.transform[prop];
        }, this, this.subscriptions);
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}

export class TransformInlineDisplay extends PartInlineDisplay<HTMLDivElement> {
    public domNode: HTMLDivElement;
    private flash : Flash = new Flash();
    constructor(part : DOMPart) {
        super(part);
        this.domNode = document.createElement('div');
        this.domNode.style.display = 'flex';
        this.domNode.style.flexDirection = 'row';
        this.domNode.style.alignItems = 'center';
        this.domNode.style.justifyContent = 'flex-end';

        // TODO: Experimental inline controls. Implements after we figured out the default values/running dynamics

        // let input = new Control(part, 'x');
        // this.domNode.appendChild(input.domNode);

        // input = new Control(part, 'y');
        // this.domNode.appendChild(input.domNode);

        this.domNode.appendChild(this.flash.domNode);
        this.domNode.style.marginRight = '8px';
        part.transform.click.event(() => {
            this.flash.trigger();
        });
    }
    onInject() {}
}
