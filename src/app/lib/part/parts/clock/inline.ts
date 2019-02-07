import { PartInlineDisplay } from '../../inline-display.js';
import { IDisposable, subscribeInterval } from '@kano/common/index.js';
import ClockPart from './clock.js';

export class ClockInlineDisplay extends PartInlineDisplay {
    public domNode: HTMLElement = document.createElement('div');
    private interval : IDisposable;
    private part : ClockPart;
    constructor(part : ClockPart) {
        super(part);
        this.part = part;
        this.domNode.style.textAlign = 'right';
        this.domNode.style.paddingRight = '46px';
        this.interval = subscribeInterval(() => {
            this.render();
        }, 1000);
        this.render();
    }
    render() {
        this.domNode.textContent = this.part.get('time');
    }
    onInject() {}
    dispose() {
        this.interval.dispose();
    }
}