import { DongleModule } from './dongle.js';

export class MotionModule extends DongleModule {
    static get id() { return 'motionSensor'; }
}

export default MotionModule;
