import PowerUpDevice from './power-up-device.js';

class TiltSensor extends PowerUpDevice {
    constructor(options, master) {
        super(options, master);

        const tokens = this.id.split('-');

        this.number = tokens[tokens.length - 1];

        this._socketOn(`gyro-accelerometer:${this.number}:gyro-data`, (value) => {
            this.emitter.emit('gyro-data', value);
        });
        this._socketOn(`gyro-accelerometer:${this.number}:accelerometer-data`, (value) => {
            this.emitter.emit('accelerometer-data', value);
        });
    }
}

export default TiltSensor;
