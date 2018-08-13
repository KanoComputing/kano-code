import DongleModule from './dongle.js';

class TiltModule extends DongleModule {
    static get name() { return 'gyroAccelerometer'; }
}

export default TiltModule;
