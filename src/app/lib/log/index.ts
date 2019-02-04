import { LEVEL, LEVEL_NAMES, LEVEL_STYLES } from './level.js';

class Logger {
    public level : number;
    constructor() {
        this.level = LEVEL.OFF;
    }
    setLevel(level : number) {
        this.level = level;
    }
    log(...args : any[]) {
        if (this.level > LEVEL.OFF) {
            console.log(`%c[${LEVEL_NAMES[this.level]}]`, LEVEL_STYLES[this.level], ...args);
        }
    }
    trace(...args : any[]) {
        if (this.level <= LEVEL.TRACE) {
            this.log(...args);
        }
    }
    debug(...args : any[]) {
        if (this.level <= LEVEL.DEBUG) {
            this.log(...args);
        }
    }
    info(...args : any[]) {
        if (this.level <= LEVEL.INFO) {
            this.log(...args);
        }
    }
    warn(...args : any[]) {
        if (this.level <= LEVEL.WARN) {
            console.warn(...args);
        }
    }
    error(...args : any[]) {
        if (this.level <= LEVEL.ERROR) {
            console.error(...args);
        }
    }
}

export { Logger, LEVEL };
export default Logger;
