import EventEmitter from '../util/event-emitter.js';

class HardwareAPIMock extends EventEmitter {
    // Returns an already opened connection if exists, otherwise creates a new one and returns it
    static connect(url, nativeWS) {
        
    }

    /**
     * Ask a socket the connected devices. Times out after 20 seconds
     */
    static getTopDevices(socket) {
        return new Promise().resolve([]);
    }

    getDeviceById(id) {
        
    }

    requestDeviceUpdate() {}

    setParts(parts) {}

    getAllDevices() {
        return [];
    }

    /**
     * Add and try to find an existing match for the device
     */
    addDevice(device) {}

    /**
     * Unbinds and remove a device
     */
    removeDevice(device) {}

    /**
     * Try to match a device to part. Notify of a new Device creation if
     * no match was found
     */
    findOrCreatePartForDevice(device) {}

    /**
     * Find a part matching the device and frees it
     */
    unbindPartFromDevice(device) {}

    /**
     * Wipe all the bindings between parts and devices and rematch them all
     */
    reassignDevices() {}

    debounce(id, cb, delay) {
        if (this._debouncers[id]) {
            clearTimeout(this._debouncers[id]);
        }
        this._debouncers[id] = setTimeout(cb, delay);
    }

    getPartForDevice(deviceId) {
        return null;
    }

    getDeviceForPart(partId) {
        return undefined;
    }

    _getPartById(partId) {
        return null;
    }

    /**
     * A KitDevice will have a devices property with all its
     * slave devices when it has finished setting up.
     * Return true if that array is not present yet.
     */
    anyKitDeviceNotReady(devices) {}

    _doGetAllDevices(root) {
        return [];
    }

    tearDown() {}
}

export default HardwareAPIMock;
