import { DongleBase } from './dongle-base.js';
import { Spring } from '../spring.js';

const MotionSensorImpl = {
    module: 'motionSensor',
    onCreated () {
        this._onProximityDataChanged = this._onProximityDataChanged.bind(this);
        this._generateUpdate = this._generateUpdate.bind(this);
        this._onGestureChanged = this._onGestureChanged.bind(this);
        this.handlers = {
            'proximity-data': this._onProximityDataChanged,
            'gesture': this._onGestureChanged
        };
        DongleBase.onCreated.apply(this);

        this.spring = new Spring(1, 400, 20);
        this.spring.snap(0);
        this.reset();
    },
    start () {
        DongleBase.start.apply(this, arguments);
        this._updateLoop = requestAnimationFrame(this._generateUpdate);
    },
    stop () {
        DongleBase.stop.apply(this, arguments);
        cancelAnimationFrame(this._updateLoop);
        this.reset();
    },
    reset () {
        if (this.model && this.model.lastProximityValue) {
            this.set('model.lastProximityValue', 0);
        }
        this._listeners = [];
    },
    _generateUpdate () {
        let newValue = Math.max(0, Math.min(100, Math.round(this.spring.x() * 100)));

        this._triggerListeners(newValue, this.model.lastProximityValue);
        this.set('model.lastProximityValue', newValue);
        this.fire('proximity-update');

        requestAnimationFrame(this._generateUpdate);
    },
    _onProximityDataChanged (e) {
        this.spring.setEnd(this.dataToPercentage(e.proximity) / 100);
    },
    _onGestureChanged (e) {
        if (e.type) {
            this.set('model.gestureValue', e.type);
            //reset the value to trigger observers on identical gesture values
            setTimeout(() => this.set('model.gestureValue', null), 0);
            let fireString = 'gesture-' + e.type;
            this.fire(fireString);
        }
    },
    _triggerListeners (newValue, oldValue) {
        const zoneSize = 100 / 5;                 // 100 is the whole span, 5 is the number of zones
        this._listeners.forEach(listener => {
            let zoneClamp = [(listener.zone - 1) * zoneSize, listener.zone * zoneSize];
            // Was outside of the clamp and now is inside
            if ((oldValue < zoneClamp[0] || oldValue > zoneClamp[1]) &&
                (newValue >= zoneClamp[0] && newValue <= zoneClamp[1])) {
                    listener.callback();
                }
        });
    },
    whenEntersZone (zone, callback) {
        this._listeners.push({ zone, callback });
    },
    getValue () {
        return this.model.lastProximityValue;
    },
    dataToPercentage (value) {
        return Math.round((value / 255) * 100);
    },
    setMode (mode) {
        let device = this.appModules.getModule(this.module).getDeviceForPart(this.id);

        if (device) {
            device.setMode(mode);
        }
    },
    setUpdateInterval (interval) {
        let device = this.appModules.getModule(this.module).getDeviceForPart(this.id);

        if (device) {
            device.setUpdateInterval(interval);
        }
    }
};

export const MotionSensor = Object.assign({}, DongleBase, MotionSensorImpl);
