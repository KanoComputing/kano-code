import { Base } from './base.js';

// @polymerBehavior
const DongleBaseImpl = {
    _listeners: [],
    handlers: [],
    onCreated () {
        Base.onCreated.apply(this);
        this.mappingChangedEventListener = this.mappingChangedEventListener.bind(this);
        if (this.model && this.handlers) {
            this.appModules.getModule(this.module).on(this.model.id + '-mapping-changed', this.mappingChangedEventListener);
            this.remapListeners(null, this.appModules.getModule(this.module).getDeviceForPart(this.model.id), true);
        }
    },
    onDestroyed () {
        if (this.model && this.handlers) {
            this.appModules.getModule(this.module).removeListener(this.model.id + '-mapping-changed', this.mappingChangedEventListener);
            this.remapListeners(this.appModules.getModule(this.module).getDeviceForPart(this.model.id), null);
        }
    },
    start () {
        Base.start.apply(this, arguments);
    },
    mappingChangedEventListener (e) {
        this.remapListeners(e.detail.oldDevice, e.detail.newDevice, true);
        if (!this.isRunning && this.model.connected !== !!e.detail.newDevice) {
            this.set('model.connected', !!e.detail.newDevice);
        }
    },
    remapListeners (oldDevice, newDevice, notify) {
        if (oldDevice) {
            Object.keys(this.handlers).forEach((eventName) => {
                oldDevice.removeListener(eventName, this.handlers[eventName]);
            });
        }

        if (newDevice) {
            Object.keys(this.handlers).forEach((eventName) => {
                newDevice.on(eventName, this.handlers[eventName]);
            });
        }

        if (notify && !!this.model.connected !== !!newDevice) {
            this.set('model.connected', !!newDevice);
            return;
        }

        /**
         *  A part that is present onload will call the remapListeners with newDevice undefined (possible FIXME).
         *  If the device is connected, the mappingChanged function will call this function again with the correct parameters.
         *  However, if the device is not connected, we still want to set the connected property to false.
         *  We use a 1s delay to avoid connected devices displaying as disconnected momentarily.
         **/
        setTimeout(() => {
            if (notify && typeof this.model.connected === 'undefined') {
                this.set('model.connected', false);
            }
        }, 1000);
    },
    stop () {
        Base.stop.apply(this, arguments);
    }
};

export const DongleBase = Object.assign({}, Base, DongleBaseImpl);
