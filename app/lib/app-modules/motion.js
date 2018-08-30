import DongleModule from './dongle.js';

class MotionModule extends DongleModule {
    static get id() { return 'motionSensor'; }
}

export default MotionModule;
