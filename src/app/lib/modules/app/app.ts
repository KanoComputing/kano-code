import { AppModule } from '../../app-modules/app-module.js';
import { EventEmitter, IDisposable } from '@kano/common/index.js';
import { Output } from '../../output/output.js';
import { transformLegacy } from './legacy.js';
import { Part } from '../../parts/part.js';
import { DOMPart } from '../../parts/parts/dom/dom.js';

export interface IPartCollision {
    a : Part;
    b : Part;
}

interface ICollisionWatcher {
    a : string;
    b : string;
    callback : () => void;
}

const COLLISION_DETECTION_RATE = 25;

export class ApplicationModule extends AppModule {
    public _onDidStart : EventEmitter = new EventEmitter();
    public _onDidPartCollision = new EventEmitter<IPartCollision>();
    private _justRestarted : boolean = false;
    private userSubscriptions : IDisposable[] = [];
    private collisionInterval : number|null = null;
    private watchedCollisions : ICollisionWatcher[] = [];
    static transformLegacy(app : any) {
        transformLegacy(app);
    }
    constructor(output : Output) {
        super(output);
        this.addMethod('onStart', '_onStart');
        this.addMethod('onPartCollision', '_onPartCollision');
        this.addMethod('restart', '_restart');
        this.addLifecycleStep('stop', '_reset');
        this.addLifecycleStep('afterRun', '_start');
    }
    static get id() { return 'app'; }
    _onStart(callback : () => void) {
        this._onDidStart.event(callback, null, this.userSubscriptions);
    }
    _onPartCollision(a : string, b : string, callback : () => void) {
        this._setupCollisionDetection();
        this.watchedCollisions.push({ a, b, callback });
    }
    _setupCollisionDetection() {
        this._stopCollisionDetection();
        this.collisionInterval = window.setInterval(() => {
            const parts = this.output.parts.getParts();
            const partsMap = new Map<string, Part>();
            parts.forEach((a) => {
                if (!a.id) {
                    return;
                }
                partsMap.set(a.id, a);
            });
            this.watchedCollisions.forEach((watcher) => {
                const a = partsMap.get(watcher.a);
                const b = partsMap.get(watcher.b);
                if (!a || !b || a === b) {
                    return;
                }
                const aRect = (a as DOMPart).getCollidableRect();
                const bRect = (b as DOMPart).getCollidableRect();

                if (aRect.x < bRect.x + bRect.width &&
                        aRect.x + aRect.width > bRect.x &&
                        aRect.y < bRect.y + bRect.height &&
                        aRect.y + aRect.height > bRect.y) {
                    watcher.callback();
                    this._onDidPartCollision.fire({ a, b });
                }
            });
        }, COLLISION_DETECTION_RATE);
    }
    _stopCollisionDetection() {
        if (this.collisionInterval) {
            clearInterval(this.collisionInterval);
        }
    }
    _start() {
        this._onDidStart.fire();
    }
    _reset() {
        this._stopCollisionDetection();
        this.watchedCollisions = [];
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
