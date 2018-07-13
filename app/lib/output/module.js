import AppModule from '../app-modules/app-module.js';

export class OutputModule extends AppModule {
    constructor(...args) {
        super(...args);
        this.addLifecycleStep('start', '_start');
        this.addLifecycleStep('stop', '_stop');
    }
    _start() {
        this.output.outputView.start();
    }
    _stop() {
        this.output.outputView.stop();
    }
}

export default OutputModule;
