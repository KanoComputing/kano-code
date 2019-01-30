import HardwareAPI from './hardware/hardware-api.js';
import AppModules from './app-modules/index.js';

class ShareRunner {
    constructor(config) {
        this.config = config;
    }
    setParts(parts) {
        this.parts = parts;
    }
    init() {
        this.hardware = new HardwareAPI(this.config);
        this.hardware.setParts(Object.keys(this.parts).map(id => this.parts[id]));

        this.config.hardwareAPI = this.hardware;

        this.appModules = new AppModules(this.config);
    }
    start() {
        this.appModules.start();
    }
    getModule(...args) {
        return this.appModules.getModule(...args);
    }
    stop() {
        this.appModules.stop();
    }
    destroy() {
        this.stop();
        this.hardware.tearDown();
    }
}

export default ShareRunner;
