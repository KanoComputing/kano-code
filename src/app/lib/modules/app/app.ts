import { AppModule } from '../../app-modules/app-module.js';
import { EventEmitter, IDisposable } from '@kano/common/index.js';
import { Output } from '../../output/output.js';
import { transformLegacy } from './legacy.js';

export class ApplicationModule extends AppModule {
    public _onDidStart : EventEmitter = new EventEmitter();
    private _justRestarted : boolean = false;
    private userSubscriptions : IDisposable[] = [];
    static transformLegacy(app : any) {
        transformLegacy(app);
    }
    constructor(output : Output) {
        super(output);
        this.addMethod('onStart', '_onStart');
        this.addMethod('restart', '_restart');
        this.addLifecycleStep('stop', '_reset');
        this.addLifecycleStep('afterRun', '_start');
    }
    static get id() { return 'app'; }
    _onStart(callback : () => void) {
        this._onDidStart.event(callback, null, this.userSubscriptions);
    }
    _start() {
        this._onDidStart.fire();
    }
    _reset() {
        this.userSubscriptions.forEach(d => d.dispose());
        this.userSubscriptions.length = 0;
    }
    _restart() {
        if (this._justRestarted) {
            return;
        }
        this._justRestarted = true;
        this.output.restart();
        setTimeout(() => {
            this._justRestarted = false;
        });
    }
}

export default ApplicationModule;
