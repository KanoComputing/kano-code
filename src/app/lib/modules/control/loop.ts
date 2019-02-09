import { AppModule } from '../../app-modules/app-module.js';

export class LoopModule extends AppModule {
    private intervals : number[];
    constructor(output : any) {
        super(output);
        this.intervals = [];

        this.addMethod('forever', '_forever');

        this.addLifecycleStep('stop', '_stop');
    }

    static get id() { return 'loop'; }

    _forever(callback : Function) {
        // push the next tick to the end of the events queue
        const id = setInterval(callback, 10);
        this.intervals.push(id);
    }
    _stop() {
        this.intervals.forEach(id => clearInterval(id));
    }
}

export default LoopModule;
