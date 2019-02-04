import EventEmitter from '../../util/event-emitter.js';
import Plugin, { PluginLifecycleStep } from '../plugin.js';

export class PluginReceiver extends EventEmitter {
    private plugins : Plugin[] = [];
    addPlugin(plugin : Plugin) {
        this.plugins.push(plugin);
    }
    runPluginTask(taskName : PluginLifecycleStep, ...args : any[]) {
        this.plugins.forEach(plugin => (plugin[taskName] as any)(...args));
    }
    runPluginChainTask(taskName : PluginLifecycleStep, ...args : any[]) {
        return this.plugins.reduce((p, plugin) => {
            if (p instanceof Promise) {
                return p.then(() => (plugin[taskName] as any)(...args));
            }
            return (plugin[taskName] as any)(...args);
        }, Promise.resolve());
    }
}


export default PluginReceiver;
