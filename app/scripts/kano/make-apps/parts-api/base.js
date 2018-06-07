const BaseMixin = base => class extends base {
    /**
     * Do a Object.assign, but also brings in the getter/setters
     */
    applyMixin(target, source) {
        Object.assign(target, source);
        Object.keys(source).forEach((key) => {
            const desc = Object.getOwnPropertyDescriptor(source, key);
            let getter;
            let setter;
            if (typeof desc.get === 'function') {
                getter = desc.get;
            }
            if (typeof desc.set === 'function') {
                setter = desc.set;
            }
            if (getter || setter) {
                Object.defineProperty(target, key, {
                    get: getter,
                    set: setter,
                });
            }
        });
        return target;
    }
    applyMixins(target) {
        const args = Array.prototype.slice.apply(arguments);
        args.shift();
        args.forEach((source) => {
            this.applyMixin(target, source);
        });
        return target;
    }
    connectedCallback() {
        super.connectedCallback();
        this.onCreated();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.onDestroyed();
    }
    onCreated() {
        // In old apps, we refered to Kano.AppModules directly. Now we set a standalone appModules.
        // Keep this to ensure old apps and not yet updated clients still work
        this.appModules = this.appModules || Kano.AppModules;
    }
    onDestroyed() {}
    start() {
        if (this.model) {
            this.savedState = {
                position: {
                    x: this.model.position.x,
                    y: this.model.position.y,
                },
                rotation: this.model.rotation,
                scale: this.model.scale,
                visible: this.model.visible,
                userProperties: Object.assign({}, this.model.userProperties),
                userStyle: Object.assign({}, this.model.userStyle),
            };
        }
        this.isRunning = true;
    }
    when(name, callback) {
        this.userListeners = this.userListeners || {};
        if (!this.userListeners[name]) {
            this.userListeners[name] = [];
        }
        this.userListeners[name].push(callback);
        this.addEventListener(name, callback);
    }
    stop() {
        if (this.userListeners) {
            Object.keys(this.userListeners).forEach((name) => {
                if (Array.isArray(this.userListeners[name])) {
                    this.userListeners[name].forEach((callback) => {
                        this.removeEventListener(name, callback);
                    });
                }
            });
        }
        this.userListeners = {};
        if (this.savedState) {
            const savedState = this.savedState || {};
            savedState.position = savedState.position || { x: 0, y: 0 };
            this.set('model.position.x', savedState.position.x);
            this.set('model.position.y', savedState.position.y);
            this.set('model.rotation', savedState.rotation);
            this.set('model.scale', savedState.scale);
            this.set('model.visible', savedState.visible);
            Object.keys(savedState.userProperties).forEach((propName) => {
                if (this.model && this.model.nonvolatileProperties.indexOf(propName) < 0) {
                    this.set(`model.userProperties.${propName}`, savedState.userProperties[propName]);
                }
            });
            this.set('model.userStyle', savedState.userStyle);
        }
        this.isRunning = false;
    }
    moveAlong(distance) {
        let direction = (this.get('model.rotation') || 0) * Math.PI / 180,
            alongY = Math.round(parseInt(distance) * Math.sin(direction)),
            alongX = Math.round(parseInt(distance) * Math.cos(direction));
        this.move(alongX, alongY);
    }
    move(x, y) {
        const position = this.model.position;
        // Set separate values otherwise, the reference is compared and
        // change triggers are not fired
        this.set('model.position.x', position.x + x);
        this.set('model.position.y', position.y + y);
    }
    setXY(x, y) {
        this.setX(x);
        this.setY(y);
    }
    setX(x) {
        this.set('model.position.x', x);
    }
    setY(y) {
        this.set('model.position.y', y);
    }
    getX() {
        return this.get('model.position.x');
    }
    getY() {
        return this.get('model.position.y');
    }
    getSize() {
        return this.get('model.scale');
    }
    getRotation() {
        return this.get('model.rotation');
    }
    rotate(deg) {
        const rotation = this.model.rotation;
        this.set('model.rotation', parseInt(rotation) + parseInt(deg));
    }
    absolute_rotate(deg) {
        this.set('model.rotation', parseInt(deg));
    }
    scale(factor) {
        this.set('model.scale', factor);
    }
    resize(factor) {
        const curFactor = this.get('model.scale') || 100;
        this.set('model.scale', curFactor * factor / 100);
    }
    show(visibility) {
        this.set('model.visible', visibility);
    }
    toggleVisibility() {
        this.set('model.visible', !this.model.visible);
    }
    hexToRgb(hex) {
        hex = (hex) ? hex.substr(1) : 0;
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return { r, g, b };
    }
    rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;
        let s;
        const l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h, s, l };
    }
    throttle(id, cb, delay) {
        // Push the logic to next event loop iteration.
        // This let the blocking calls to the same id stack up
        setTimeout(() => {
            this.nextCall = this.nextCall || {};
            this.waiting = this.waiting || {};
            // Last call buffer time passed, call the method and create a buffer time
            if (!this.nextCall[id]) {
                // When the time has passed, check if a call was made and if so,
                // execute the callback
                this.nextCall[id] = setTimeout(() => {
                    this.nextCall[id] = null;
                    if (this.waiting[id]) {
                        this.throttle(id, this.waiting[id], delay);
                        this.waiting[id] = null;
                    }
                }, delay);
                // Execute the callback
                cb();
            } else {
                // The last call was less than `delay` ms ago, just update the waiting call
                this.waiting[id] = cb;
            }
        });
    }
};

export { BaseMixin };

export default BaseMixin;
