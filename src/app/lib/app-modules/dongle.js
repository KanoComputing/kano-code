import { AppModule } from './app-module.js';

export class DongleModule extends AppModule {
    constructor() {
        super();

        this.addMethod('on', '_on');
        this.addMethod('removeListener', '_removeListener');
        this.addMethod('getDeviceForPart', '_getDeviceForPart');
    }

    _on() {
        if (this.api) {
            this.api.on.apply(this.api, arguments);
        }
    }

    _removeListener() {
        if (this.api) {
            this.api.removeListener.apply(this.api, arguments);
        }
    }

    config(opts) {
        this.api = opts.hardwareAPI;
    }

    _getDeviceForPart() {
        if (this.api) {
            return this.api.getDeviceForPart.apply(this.api, arguments);
        }
    }
}

export default DongleModule;
