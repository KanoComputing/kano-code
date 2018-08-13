import DongleModule from './dongle.js';

class MotionModule extends DongleModule {
    static get name() { return 'motionSensor'; }
}

export default MotionModule;
