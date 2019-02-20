import { Plugin, PluginLifecycleStep } from '../plugin.js';

export class PluginReceiver {
    protected plugins : Plugin[] = [];
    addPlugin(plugin : Plugin) {
        this.plugins.push(plugin);
    }
    protected runPluginTask(taskName : PluginLifecycleStep, ...args : any[]) {
        this.plugins.forEach(plugin => (plugin[taskName] as any)(...args));
    }
    protected runPluginChainTask(taskName : PluginLifecycleStep, ...args : any[]) {
        return this.plugins.reduce((p, plugin) => {
            if (p instanceof Promise) {
                return p.then(() => (plugin[taskName] as any)(...args));
            }
            return (plugin[taskName] as any)(...args);
        }, Promise.resolve());
    }
}


export default PluginReceiver;
