import { AppModule } from '../app-modules/app-module.js';

export class OutputModule extends AppModule {
    constructor(...args) {
        super(...args);
        this.addLifecycleStep('start', '_start');
        this.addLifecycleStep('stop', '_stop');
    }
    _start() {
        if (!this.output.outputView) {
            return;
        }
        this.output.outputView.start();
    }
    _stop() {
        if (!this.output.outputView) {
            return;
        }
        this.output.outputView.stop();
    }
}

export default OutputModule;
