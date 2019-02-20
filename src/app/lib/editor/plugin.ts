import Editor from './editor';
import Output from '../output/output';

export type PluginLifecycleStep = 'onInstall'|'onInject'|'onDispose'|'onImport'|'onCreationImport'|'onExport'|'onCreationExport';

export abstract class Plugin {
    onInstall(editorOrOutput : Editor|Output) {}
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
