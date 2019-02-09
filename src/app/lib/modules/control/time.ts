import { AppModule } from '../../app-modules/app-module.js';
import Output from '../../output/output.js';

export class TimeModule extends AppModule {
    private timeouts : number[] = [];
    private intervals : number[] = [];
    private incr : number = 0;
    constructor(output : Output) {
        super(output);
        this.frames = {};

        this.addMethod('every', '_every');
        this.addMethod('later', '_later');

        this.addLifecycleStep('stop', '_stop');
    }

    static get id() { return 'time'; }

    getId() {
        return this.incr++;
    }

    _every(interval : number, unit : 'seconds'|'milliseconds'|'frames', callback : () => void) {
        if (unit === 'frames') {
            let loopId = this.getId();
            let startTimestamp : number|null = null;
            let diff;
            // Round and min to 1
            interval = Math.max(1, Math.round(interval));
            // Time interval between frames
            const dt = (1000 / 60) * interval;
            const func = (timestamp : number) => {
                // Stop right here is the code is not running
                if (!this.isRunning) {
                    startTimestamp = null;
                    return;
                }
                // First time in the loop, start right away
                if (!startTimestamp) {
                    startTimestamp = timestamp;
                    callback();
                }
                diff = timestamp - startTimestamp;
                // Enough time passed since last frame, execute the code
                if (diff >= dt) {
                    startTimestamp = timestamp;
                    callback();
                }
                this.frames[loopId] = requestAnimationFrame(func);
            };
            this.frames[loopId] = requestAnimationFrame(func);
        } else {
            // Round and min to 1
            interval = unit === 'milliseconds' ? interval : interval * 1000;
            interval = Math.max(1, Math.round(interval));
            const id = window.setInterval(callback, interval);
            this.intervals.push(id);
        }
    }

    _later(delay : number, unit : 'seconds'|'milliseconds'|'frames', callback : () => void) {
        delay = unit === 'milliseconds' ? delay : delay * 1000;
        const id = window.setTimeout(callback, Math.max(1, delay));
        this.timeouts.push(id);
    }

    _stop() {
        this.timeouts.forEach(id => clearTimeout(id));
        this.intervals.forEach(id => clearInterval(id));
        Object.keys(this.frames).forEach(loopId => cancelAnimationFrame(this.frames[loopId]));
        this.timeouts = [];
        this.intervals = [];
        this.frames = {};
        this.incr = 0;
    }
}

export default TimeModule;
