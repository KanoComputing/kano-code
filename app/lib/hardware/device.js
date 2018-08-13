class Device {
    constructor(options) {
        this.id = options.id;
        this.product = options.product;
        this.vendor = options.vendor;
        this.serialNumber = options.serialNumber;
    }

    update(options) {}
    tearDown() {}
}

export default Device;
