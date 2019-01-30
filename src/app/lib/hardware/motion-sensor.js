import PowerUpDevice from './power-up-device.js';

class MotionSensor extends PowerUpDevice {
    constructor(options, master) {
        super(options, master);

        let tokens = this.id.split('-');

        this.number = tokens[tokens.length - 1];

        this._socketOn(`motion-sensor:${this.number}:proximity-data`, (value) => {
            this.emitter.emit('proximity-data', value);
        });
        this._socketOn(`motion-sensor:${this.number}:gesture`, (value) => {
            this.emitter.emit('gesture', value);
        });
    }

    setMode(mode) {
        this.master.powerUpSocket.emit(`motion-sensor:${this.number}:set-mode`, {mode});
    }

    setUpdateInterval(interval) {
        this.master.powerUpSocket.emit(`motion-sensor:${this.number}:set-update-interval`, {interval});
    }
}

export default MotionSensor;
