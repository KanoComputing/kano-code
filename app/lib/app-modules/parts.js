import AppModule from './app-module.js';

class PartsModule extends AppModule {
    constructor(output) {
        super(output);
        this.addLifecycleStep('stop', '_stop');
        this.addLifecycleStep('start', '_start');
        this._parts = {};
        this._methods = {
            get: this._get.bind(this),
            whenCollisionBetween: this._whenCollision.bind(this),
            collisionBetween: this._collides.bind(this),
        };
    }

    static get id() { return 'parts'; }

    static get aliases() { return ['devices']; }

    getSymbols() {
        const { partsPlugin } = this.output;
        return partsPlugin.parts.map(p => p.id);
    }

    _get(name) {
        return this._parts[name];
    }

    config(config) {
        super.config(config);
        this._workspaceSize = config.WORKSPACE_FULL_SIZE;
    }

    _runDevicesMethod(name) {
        Object.keys(this._parts).forEach((deviceName) => {
            if (typeof this._parts[deviceName][name] === 'function') {
                this._parts[deviceName][name]();
            }
        });
    }

    _start() {
        const { outputView } = this.output;
        const elements = [...outputView.partsRoot.querySelectorAll('[id]')];
        this._parts = elements.reduce((acc, element) => {
            acc[element.getAttribute('id')] = element;
            return acc;
        }, {});
        this.methods = Object.assign({}, this._methods, this._parts);
        this._runDevicesMethod('start');
        this._reset();
        this._startCollisionLoop();
    }

    _stop() {
        this._runDevicesMethod('stop');
        this._stopCollisionLoop();
        this._reset();
    }

    _startCollisionLoop() {
        this._stopCollisionLoop();
        this._collisionInterval = setInterval(this._checkCollisions.bind(this), 20);
    }

    _stopCollisionLoop() {
        clearInterval(this._collisionInterval);
    }

    _whenCollision(part1, part2, callback) {
        let part1Id,
            part2Id;
        if (!part1 || !part2) {
            return;
        }
        part1Id = this._getCollidableId(part1);
        part2Id = this._getCollidableId(part2);
        // Group by part to check collision with
        // 100 listeners added will only check the collision between two parts once
        const listenerId = [part1Id, part2Id].sort().join('#');
        this._listeners[listenerId] = this._listeners[listenerId] || {
            part1,
            part2,
            callbacks: [],
        };
        this._listeners[listenerId].callbacks.push(callback);
    }

    _getCollidableId(part) {
        return typeof part === 'string' ? part : part.id;
    }

    _collides(part1, part2) {
        let collides,
part1Rect;
        if (!part1 || !part2) {
            return;
        }
        // We receive an edge address as part2
        if (typeof part2 === 'string'
            && typeof part1.getCollidableRect === 'function') {
            part1Rect = part1.getCollidableRect();
            // Different detection for each edges
            switch (part2) {
            case '@top-edge':
                collides = Math.ceil(part1Rect.y) + 0.2 < 0;
                break;
            case '@right-edge':
                collides = Math.ceil(part1Rect.x + part1Rect.width) + 0.2 > this._workspaceSize.width;
                break;
            case '@bottom-edge':
                collides = Math.ceil(part1Rect.y + part1Rect.height) + 0.2 > this._workspaceSize.height;
                break;
            case '@left-edge':
                collides = Math.ceil(part1Rect.x) + 0.2 < 0;
                break;
            default:
                collides = false;
                break;
            }
        } else if (typeof part1.collidesWith === 'function'
            && typeof part2.collidesWith === 'function') {
            collides = part1.collidesWith(part2);
        }
        return collides;
    }

    _checkCollisions() {
        let listener;
        Object.keys(this._listeners).forEach((collisionKey) => {
            listener = this._listeners[collisionKey];
            if (this._collides(listener.part1, listener.part2)) {
                listener.callbacks.forEach((cb) => {
                    cb.call({});
                });
            }
        });
    }

    _reset() {
        this._listeners = {};
    }
}

export default PartsModule;
