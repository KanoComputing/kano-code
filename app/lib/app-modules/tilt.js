import DongleModule from './dongle.js';

class TiltModule extends DongleModule {
    static get id() { return 'gyroAccelerometer'; }
}

export default TiltModule;
