import { DongleBase } from './dongle-base.js';

const GyroAccelerometerImpl = {
    module: 'gyroAccelerometer',
    onCreated () {
        this._onAccelorometerDataChanged = this._onAccelorometerDataChanged.bind(this);
        this._onGyroDataChanged = this._onGyroDataChanged.bind(this);
        this.handlers = {
            'gyro-data': this._onGyroDataChanged,
            'accelerometer-data': this._onAccelorometerDataChanged,
        };
        DongleBase.onCreated.apply(this);
    },
    start () {
        DongleBase.start.apply(this, arguments);
        this.lastGyroVector = { x: 0, y: 0, z: 0 };
        this.lastAccelVector = { x: 0, y: 0, z: 0 };
    },
    getGyroData (axis) {
        return this.lastGyroVector[axis];
    },
    getAccelerometerData (axis) {
        return this.lastAccelVector[axis];
    },
    _onGyroDataChanged (e) {
        this.lastGyroVector = e;
        this.fire('gyro-accel-update');
    },
    _onAccelorometerDataChanged (e) {
        this.lastAccelVector = e;
        this.fire('gyro-accel-update');
    }
};
export const GyroAccelerometer = Object.assign({}, DongleBase, GyroAccelerometerImpl);
