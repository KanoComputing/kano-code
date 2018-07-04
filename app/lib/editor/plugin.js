/* eslint class-methods-use-this: "off" */
import EventEmitter from '../util/event-emitter.js';

export class Plugin extends EventEmitter {
    onInstall() {}
    onModeSet() {}
    onInject() {}
    onAppLoad() {}
    onSave(app) {
        return app;
    }
}

export default Plugin;
