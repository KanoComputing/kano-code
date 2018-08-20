import Device from './device.js';

class KitDevice extends Device {
    constructor(options, hwapi) {
        super(options);

        this.hwapi = hwapi;

        this.update(options);
    }

    /**
     * A change was detected in the configuration of the Kit.
     * Update the web socket connections and update all devices
     */
    update(options) {
        this.url = options.url || null;
        this.serial = options.serial || false;

        if (this.url || this.serial) {
            if (this.socket) {
                this.socket.removeAllListeners('disconnect');
            }
            this.serialSocket = null;
            this.networkSocket = null;
            this.socket = null;
            if (this.serial) {
                this.serialSocket = HardwareAPI.connect(this.hwapi.url);
            }
            if (this.url) {
                this.networkSocket = HardwareAPI.connect(this.url, (this.product == 'RPK'));
            }
            this.socket = this.serial ? this.serialSocket : this.networkSocket;
            this.powerUpSocket = this.networkSocket;

            this.updateDevices().then(() => {
                this.networkSocket.on('device-added', (info) => {
                    const device = HardwareAPI.instanciateDevice(info, this);
                    this.addDevice(device);
                });

                this.networkSocket.on('device-removed', (info) => {
                    let device = this.hwapi.getDeviceById(this.id + '-' + info.id);
                    if (device) {
                        this.removeDevice(device);
                    }
                });
            });

            this.networkSocket.on('volume', (volume) => {
                this.volume = volume;
            });

            // Volume events from the RPK
            this.networkSocket.on('mic-clap', mic => {
                this.volume = mic.value;
            });

            this.networkSocket.on('disconnect', () => {});

            // Tells the Kano Code App to enable OTG control on the Kit
            if (this.serialSocket) {
                this.socket.emit('serial-init');
            }
        }
    }

    /**
     * Update the list of devices connected to this Kit.
     * Ensures the web socket connection is opened, then queries the devices.
     */
    updateDevices() {
        const socket = this.socket;
        // No socket, can't query devices
        if (socket) {
            let ensureConnected = (socket) => {
                if (!socket.connected) {
                    return new Promise((resolve, reject) => {
                        let onConnected = () => {
                            socket.removeListener('connect', onConnected);
                            resolve();
                        };
                        socket.on('connect', onConnected);
                    });
                }
                return Promise.resolve();
            };
            return ensureConnected(this.networkSocket).then(() => {
                return HardwareAPI.getTopDevices(this.networkSocket);
            }).then(devices => {
                this.devices = devices.map(d => {
                    return HardwareAPI.instanciateDevice(d, this);
                });
                this.hwapi.reassignDevices();
            });
        }
    }

    /**
     * Add and try to find an existing match for the device
     */
    addDevice(device) {
        this.devices.push(device);
        this.hwapi.findOrCreatePartForDevice(device);
    }

    /**
     * Unbinds and remove a device
     */
    removeDevice(device) {
        const index = this.devices.indexOf(device);
        this.hwapi.unbindPartFromDevice(device);
        device.tearDown();
        if (index !== -1) {
            this.devices.splice(index, 1);
        }
    }

    getSocket(socketType) {
        let socket = this.socket;
        if (socketType) {
            socket = this[socketType];
        }
        return socket;
    }

    emit(name, detail) {
        if (this.socket) {
            this.socket.emit(name, detail);
        }
    }

    on(name, cb, socketType) {
        let socket = this.getSocket(socketType);
        if (socket) {
            socket.on(name, cb);
        }
    }

    removeListener(name, cb, socketType) {
        let socket = this.getSocket(socketType);
        if (socket) {
            socket.removeListener(name, cb);
        }
    }

    removeAllListeners(name, socketType) {
        let socket = this.getSocket(socketType);
        if (socket) {
            socket.removeAllListeners(name);
        }
    }

    tearDown() {
        if (this.networkSocket) {
            this.networkSocket.close();
        }
        if (this.serialSocket) {
            this.serialSocket.close();
        }
    }
}

export default KitDevice;
