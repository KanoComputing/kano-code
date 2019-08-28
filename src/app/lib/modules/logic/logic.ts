import { AppModule } from '../../app-modules/app-module.js';
import { transformLegacyLogic } from './legacy.js';

export class LogicModule extends AppModule {
    static transformLegacy(app : any) {
        transformLegacyLogic(app);
    }
    static get id() { return 'logic'; }
}

export default LogicModule;
