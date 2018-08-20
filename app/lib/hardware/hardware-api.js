import PowerUpDevice from './power-up-device.js';
import MotionSensor from './motion-sensor.js';
import TiltSensor from './tilt-sensor.js';
import NativeWebSocket from './native-web-socket.js';
import KitDevice from './kit-device.js';
import Lightboard from './lightboard.js';
import Camera from './camera.js';
import EventEmitter from '../util/event-emitter.js';
import HardwareAPIMock from './mock.js';

const productToClassMap = {
    lightboard: Lightboard,
    camera: Camera,
    'gyro-accelerometer': TiltSensor,
    'motion-sensor': MotionSensor,
    RPK: Lightboard,
};

/**
 *  -> Has a [] of parts's models
 *  -> Receives an event when a new part is added
 *  -> Receives an event when hw changes
 *  -> Matches added parts to free devices
 *  -> Sets matched status to models to update user interface
 *  ->
 */

// ----
class HardwareAPI extends EventEmitter {
    constructor(config) {
        super();

        if (config.USE_HARDWARE_API) {
            this._debouncers = {};
            if (config) {
                this.config(config);
            }
        } else {
            return new HardwareAPIMock();
        }
    }

    // Returns an already opened connection if exists, otherwise creates a new one and returns it
    static connect(url, nativeWS) {
        if (!HardwareAPI.sockets[url] || !HardwareAPI.sockets[url].connected) {
            HardwareAPI.sockets[url] = nativeWS ? new NativeWebSocket(url) : io.connect(url);
        }
        return HardwareAPI.sockets[url];
    }

    /**
     * Returns an instance of a Device from a device information.
     */
    static instanciateDevice(info, api) {
        const deviceClass = productToClassMap[info.product] || PowerUpDevice;
        return new deviceClass(info, api);
    }

    /* DO NOT CALL THIS METHOD FROM OUTSIDE THE CLASS
        * This is here purely for backwards-compatibility with old
        * exported apps.
        */
    config(config) {
        let ensureConnectionIsOpened;
        this.devices = [];
        this.url = this._getAPIUrl(config);
        this.partsToDevicesMap = {};

        this.parts = null;

        // Connect to the Kano Code App
        this.socket = HardwareAPI.connect(this.url);
        this.powerUpSocket = this.socket;

        ensureConnectionIsOpened = () => {
            if (!this.socket.connected) {
                return new Promise((resolve, reject) => {
                    this.socket.on('connect', resolve);
                });
            }
            return Promise.resolve();
        };

        // Wait until the connection is opened
        ensureConnectionIsOpened().then(() => 
            // Initialise the devices
             HardwareAPI.getTopDevices(this.socket)
        ).then((devices) => {
            // Instanciate all the devices found
            this.devices = devices.map((d) => HardwareAPI.instanciateDevice(d, this));

            // Assign the new devices to the existing parts
            this.reassignDevices();

            // Update the sockets when the serial status changed
            this.socket.on('device-serial-connected', (d) => {
                const device = this.getDeviceById(d.id);
                device.update(d, this);
            });

            this.socket.on('device-serial-disconnected', (d) => {
                const device = this.getDeviceById(d.id);
                // The device can be removed as soon as it looses it serial connection
                if (device) {
                    device.update(d, this);
                }
            });

            // Create and match a device when added
            this.socket.on('device-added', (info) => {
                const device = HardwareAPI.instanciateDevice(info, this);
                this.addDevice(device);
            });

            // Unbinds and delete a device when disconnected
            this.socket.on('device-removed', (info) => {
                const device = this.getDeviceById(info.id);
                if (device) {
                    this.removeDevice(device);
                }
            });
            this.emit('ready');
        });
    }

    /**
     * Ask a socket the connected devices. Times out after 20 seconds
     */
    static getTopDevices(socket) {
        return new Promise((resolve, reject) => {
            let timeoutId;
            const deviceUpdateCallback = (devices) => {
                socket.removeListener('device-update', deviceUpdateCallback);
                clearTimeout(timeoutId);
                resolve(devices);
            };
            socket.on('device-update', deviceUpdateCallback);
            timeoutId = setTimeout(() => {
                socket.removeListener('device-update', deviceUpdateCallback);
                throw new Error('Could not get devices over web sockets after 20 seconds');
            }, 20000);
            socket.emit('request-device-update');
        });
    }

    getDeviceById(id) {
        const devices = this._doGetAllDevices(this.devices);
        for (let i = 0; i < devices.length; i++) {
            if (devices[i].id === id) {
                return devices[i];
            }
        }
    }

    requestDeviceUpdate() {
        this.socket.emit('request-device-update');
    }

    setParts(parts) {
        this.parts = parts;
        this.reassignDevices();
    }

    getAllDevices() {
        return this._doGetAllDevices(this.devices);
    }

    _cleanupDeviceMap() {
        let existingPartsIds = this.parts.map(part => part.id),
            existingDevicesIds = this.devices.map(dev => dev.id);

        Object.keys(this.partsToDevicesMap).forEach((partId) => {
            const dev = this.partsToDevicesMap[partId];

            if (existingPartsIds.indexOf(partId) < 0 ||
                existingDevicesIds.indexOf(dev.id) < 0) {
                this.emit(`${partId}-mapping-changed`, {
                    detail: {
                        oldDevice: this.partsToDevicesMap[partId],
                        newDevice: null,
                    },
                });

                delete this.partsToDevicesMap[partId];
            }
        });
    }

    _partSupportsDevice(part, dev) {
        return part.supportedHardware &&
                part.supportedHardware.indexOf(dev.product) >= 0;
    }

    _partIsFreeAndMatchesDevice(part, device) {
        return !this.getDeviceForPart(part.id) && this._partSupportsDevice(part, device);
    }

    /**
     * Find an available match for a device
     */
    _findFreeMatchingPartForDevice(dev) {
        const preferredPart = HardwareAPI.bindingHistory[dev.serialNumber];
        if (!this.parts) {
            return;
        }

        if (preferredPart && this._partIsFreeAndMatchesDevice(preferredPart, dev)) {
            if (this.parts.indexOf(preferredPart) > -1) {
                return preferredPart;
            } 
                delete HardwareAPI.bindingHistory[dev.serialNumber];
            
        }
        for (let i = 0; i < this.parts.length; i++) {
            if (this._partIsFreeAndMatchesDevice(this.parts[i], dev)) {
                return this.parts[i];
            }
        }
        return null;
    }

    /**
     * Add and try to find an existing match for the device
     */
    addDevice(device) {
        this.devices.push(device);
        this.findOrCreatePartForDevice(device);
    }

    /**
     * Unbinds and remove a device
     */
    removeDevice(device) {
        const index = this.devices.indexOf(device);
        this.unbindPartFromDevice(device);
        device.tearDown();
        if (index !== -1) {
            this.devices.splice(index, 1);
        }
    }

    /**
     * Try to match a device to part. Notify of a new Device creation if
     * no match was found
     */
    findOrCreatePartForDevice(device) {
        // The device is already bound, abort
        if (this.getPartForDevice(device.id)) {
            return;
        }
        // Find a part that could be bound to this device
        const part = this._findFreeMatchingPartForDevice(device);

        if (part) {
            // Bind the part to the device
            this.partsToDevicesMap[part.id] = device;
            HardwareAPI.bindingHistory[device.serialNumber] = part;
            // Notify the change
            this.emit(`${part.id}-mapping-changed`, {
                detail: {
                    oldDevice: null,
                    newDevice: this.partsToDevicesMap[part.id],
                },
            });
        } else {
            // Request a new part to be added
            setTimeout(() => {
                this.emit('new-part-request', { detail: device });
            }, 0);
        }
    }

    /**
     * Find a part matching the device and frees it
     */
    unbindPartFromDevice(device) {
        const part = this.getPartForDevice(device.id);
        // No part was boudn to this device, abort
        if (!part) {
            return;
        }
        // Free up the bind to the part
        delete this.partsToDevicesMap[part.id];
        // Notify the change
        this.emit(`${part.id}-mapping-changed`, {
            detail: {
                oldDevice: this.partsToDevicesMap[part.id],
                newDevice: null,
            },
        });
    }

    /**
     * Wipe all the bindings between parts and devices and rematch them all
     */
    reassignDevices() {
        if (!this.parts || this.anyKitDeviceNotReady(this.devices)) {
            return;
        }
        this.debounce('reassign-devices', () => {
            this._cleanupDeviceMap();
            this._doGetAllDevices(this.devices).forEach((dev) => {
                this.findOrCreatePartForDevice(dev);
            });
        }, 100);
    }

    debounce(id, cb, delay) {
        if (this._debouncers[id]) {
            clearTimeout(this._debouncers[id]);
        }
        this._debouncers[id] = setTimeout(cb, delay);
    }

    getPartForDevice(deviceId) {
        const partIds = Object.keys(this.partsToDevicesMap);

        for (let i = 0; i < partIds.length; i++) {
            let partId = partIds[i],
                dev = this.partsToDevicesMap[partId];

            if (dev.id === deviceId) {
                return this._getPartById(partId);
            }
        }

        return null;
    }

    getDeviceForPart(partId) {
        return this.partsToDevicesMap[partId];
    }

    _getPartById(partId) {
        for (let i = 0; i < this.parts.length; i++) {
            if (this.parts[i].id === partId) {
                return this.parts[i];
            }
        }

        return null;
    }

    /**
     * A KitDevice will have a devices property with all its
     * slave devices when it has finished setting up.
     * Return true if that array is not present yet.
     */
    anyKitDeviceNotReady(devices) {
        for (let i = 0; i < devices.length; i++) {
            if (devices[i] instanceof KitDevice
                    && devices[i].socket && devices[i].socket.connected
                            && !devices[i].devices) {
                return true;
            }
        }
    }

    _doGetAllDevices(root) {
        const result = [];

        root.forEach((device) => {
            result.push(device);
            if (device instanceof KitDevice && device.devices) {
                this._doGetAllDevices(device.devices).forEach((slave) => {
                    result.push(slave);
                });
            }
        });

        return result;
    }

    _getAPIUrl(c) {
        if (c.HOST) {
            let url = 'http://' + c.HOST;
            if (c.PORT) {
                url += ':' + c.PORT;
            }
            return url;
        } 
            return c.HARDWARE_API_URL;
        
    }

    tearDown() {
        this.getAllDevices().forEach((device) => {
            device.tearDown();
        });
        this.socket.close();
    }
}

// Static pool of connections
HardwareAPI.sockets = {};
// Keeps a history of bindings between device serial number and part
HardwareAPI.bindingHistory = {};

export default HardwareAPI;
