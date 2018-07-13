class AppModule {
    constructor(output) {
        this.output = output;
        this.lifecycle = {};
        this.methods = {};
        this.symbols = [];
    }
    getSymbols() {
        return this.symbols;
    }
    config() {}
    addMethod(name, cbName) {
        if (typeof this[cbName] === 'function') {
            this.methods[name] = this[cbName].bind(this);
        } else {
            this.methods[name] = this[cbName];
        }
    }
    addLifecycleStep(name, cbName) {
        this.lifecycle[name] = this[cbName].bind(this);
    }
    executeLifecycleStep(name) {
        if (name === 'start') {
            this.isRunning = true;
        } else if (name === 'stop') {
            this.isRunning = false;
        }
        if (typeof this.lifecycle[name] === 'function') {
            this.lifecycle[name].call(this);
        }
    }
    throttle(id, cb, delay) {
        // Push the logic to next event loop iteration.
        // This let the blocking calls to the same id stack up
        setTimeout(() => {
            AppModule.nextCall = AppModule.nextCall || {};
            AppModule.waiting = AppModule.waiting || {};
            // Last call buffer time passed, call the method and create a buffer time
            if (!AppModule.nextCall[id]) {
                // When the time has passed, check if a call was made and if so,
                // execute the callback
                AppModule.nextCall[id] = setTimeout(() => {
                    AppModule.nextCall[id] = null;
                    if (AppModule.waiting[id]) {
                        this.throttle(id, AppModule.waiting[id], delay);
                        AppModule.waiting[id] = null;
                    }
                }, delay);
                // Execute the callback
                cb();
            } else {
                // The last call was less than `delay` ms ago, just update the waiting call
                AppModule.waiting[id] = cb; 
            }
        });
    }
}

export default AppModule;
