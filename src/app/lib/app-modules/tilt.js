import { DongleModule } from './dongle.js';

export class TiltModule extends DongleModule {
    static get id() { return 'gyroAccelerometer'; }
}

export default TiltModule;
