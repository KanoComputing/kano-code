import { AppModule } from './app-module.js';

export class LoopModule extends AppModule {
    constructor() {
        super();
        this.intervals = [];

        this.addMethod('forever', '_forever');

        this.addLifecycleStep('stop', '_stop');
    }

    static get id() { return 'loop'; }

    _forever(callback) {
        // push the next tick to the end of the events queue
        const id = setInterval(callback, 10);
        this.intervals.push(id);
    }
    _stop() {
        this.intervals.forEach(id => clearInterval(id));
    }
}

export default LoopModule;
