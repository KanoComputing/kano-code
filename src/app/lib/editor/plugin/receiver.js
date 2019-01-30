import EventEmitter from '../../util/event-emitter.js';

export class PluginReceiver extends EventEmitter {
    constructor(...args) {
        super(...args);
        this.plugins = [];
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
    }
    runPluginTask(taskName, ...args) {
        this.plugins.forEach(plugin => plugin[taskName](...args));
    }
    runPluginChainTask(taskName, ...args) {
        return this.plugins.reduce((p, plugin) => {
            if (p instanceof Promise) {
                return p.then(() => plugin[taskName](...args));
            }
            return plugin[taskName](...args);
        }, Promise.resolve());
    }
}


export default PluginReceiver;
