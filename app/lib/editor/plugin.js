/* eslint class-methods-use-this: "off" */
import EventEmitter from '../util/event-emitter.js';

export class Plugin extends EventEmitter {
    onInstall() {}
    onInject() {}
    onImport() {}
    onCreationImport() {}
    onExport(data) {
        return data;
    }
    onCreationExport(data) {
        return data;
    }
}

export default Plugin;
