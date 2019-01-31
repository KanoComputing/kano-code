import AppModules from './app-modules/index.js';

class ShareRunner {
    constructor(config) {
        this.config = config;
    }
    setParts(parts) {
        this.parts = parts;
    }
    init() {
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
