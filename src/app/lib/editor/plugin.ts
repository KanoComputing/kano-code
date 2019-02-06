import EventEmitter from '../util/event-emitter.js';

export type PluginLifecycleStep = 'onInstall'|'onInject'|'onDispose'|'onImport'|'onCreationImport'|'onExport'|'onCreationExport';

export class Plugin extends EventEmitter {
    onInstall(editorOrOutput : any) {}
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
