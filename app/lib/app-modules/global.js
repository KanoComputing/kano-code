import AppModule from './app-module.js';

class GlobalModule extends AppModule {
    constructor(output) {
        super(output);
        this.addMethod('when', '_when');
        this.addMethod('emit', '_emit');
        this.addMethod('restartCode', '_restartCode');
        this.addLifecycleStep('stop', '_reset');
        this.addLifecycleStep('afterRun', '_afterRun');
        this._reset();
    }

    static get name() { return 'global'; }

    _when(name, callback) {
        this._listeners[name] = this._listeners[name] || [];
        this._listeners[name].push(callback);
    }

    _emit(name, data) {
        const listeners = this._listeners[name];
        if (!listeners || !Array.isArray(listeners)) {
            return;
        }
        listeners.forEach((cb) => {
            if (typeof cb === 'function') {
                setTimeout(() => {
                    cb.call({}, data);
                });
            }
        });
    }

    _reset() {
        this._listeners = {};
    }

    _restartCode() {
        this.output.restartApp();
    }

    _afterRun() {
        this._emit('start');
    }
}

export default GlobalModule;
