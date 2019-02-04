import { AppModule } from './app-module.js';

export class GlobalModule extends AppModule {
    private _listeners : { [K : string] : Function[] } = {};
    constructor(output : any) {
        super(output);
        this.addMethod('when', '_when');
        this.addMethod('emit', '_emit');
        this.addMethod('restartCode', '_restartCode');
        this.addLifecycleStep('stop', '_reset');
        this.addLifecycleStep('afterRun', '_afterRun');
        this._reset();
    }

    static get id() { return 'global'; }

    _when(name : string, callback : Function) {
        this._listeners[name] = this._listeners[name] || [];
        this._listeners[name].push(callback);
    }

    _emit(name : string, data? : any) {
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
        if (this._restarted) {
            return;
        }
        this._restarted = true;
        this.output.restart();
        setTimeout(() => {
            this._restarted = false;
        });
    }

    _afterRun() {
        this._emit('start');
    }
}

export default GlobalModule;
