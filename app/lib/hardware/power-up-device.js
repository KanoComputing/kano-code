import Device from './device.js';

class PowerUpDevice extends Device {
    constructor(options, master) {
        super(options);

        this.master = master;
        if (!(master instanceof HardwareAPI)) {
            this.id = `${master.id}-${this.id}`;
        }

        this.emitter = new EventEmitter();
    }

    _socketOn(name, cb) {
        if (this.master.powerUpSocket) {
            this.master.powerUpSocket.on(name, cb);
        }
    }

    _socketRemoveListener(name, cb) {
        if (this.master.powerUpSocket) {
            this.master.powerUpSocket.removeListener(name, cb);
        }
    }

    on() {
        this.emitter.on.apply(this.emitter, arguments);
    }

    removeListener() {
        this.emitter.removeListener.apply(this.emitter, arguments);
    }

    removeAllListeners() {
        this.emitter.removeAllListeners.apply(this.emitter, arguments);
    }
}

export default PowerUpDevice;
