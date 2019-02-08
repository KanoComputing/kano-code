import { PartInlineDisplay } from '../../inline-display.js';
import { IDisposable, subscribeInterval } from '@kano/common/index.js';
import { ClockPart } from './clock.js';
import { KCClockDisplay } from './kc-clock-display.js';

export class ClockInlineDisplay extends PartInlineDisplay {
    public domNode: KCClockDisplay = new KCClockDisplay();
    private interval : IDisposable;
    constructor(part : ClockPart) {
        super(part);
        this.interval = subscribeInterval(() => {
            this.render();
        }, 1000);
        this.render();
    }
    render() {
        this.domNode.setTime(new Date())
    }
    onInject() {}
    dispose() {
        this.interval.dispose();
    }
}