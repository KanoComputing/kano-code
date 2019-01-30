import { LEVEL, LEVEL_NAMES, LEVEL_STYLES } from './level.js';

class Logger {
    constructor() {
        this.level = LEVEL.OFF;
    }
    setLevel(level) {
        this.level = level;
    }
    log(...args) {
        if (this.level > LEVEL.OFF) {
            console.log(`%c[${LEVEL_NAMES[this.level]}]`, LEVEL_STYLES[this.level], ...args);
        }
    }
    trace(...args) {
        if (this.level <= LEVEL.TRACE) {
            this.log(...args);
        }
    }
    debug(...args) {
        if (this.level <= LEVEL.DEBUG) {
            this.log(...args);
        }
    }
    info(...args) {
        if (this.level <= LEVEL.INFO) {
            this.log(...args);
        }
    }
    warn(...args) {
        if (this.level <= LEVEL.WARN) {
            console.warn(...args);
        }
    }
    error(...args) {
        if (this.level <= LEVEL.ERROR) {
            console.error(...args);
        }
    }
}

export { Logger, LEVEL };
export default Logger;
