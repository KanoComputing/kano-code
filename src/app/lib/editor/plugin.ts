/* eslint class-methods-use-this: "off" */
import EventEmitter from '../util/event-emitter.js';

export class Plugin extends EventEmitter {
    onInstall() {}
    onInject() {}
    onDispose() {}
    onImport() {}
    onCreationImport() {}
    onExport(data : any) {
        return data;
    }
    onCreationExport(data : any) {
        return data;
    }
}

export default Plugin;
