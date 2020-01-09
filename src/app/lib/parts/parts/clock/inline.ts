/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

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
    onDispose() {
        this.interval.dispose();
    }
}