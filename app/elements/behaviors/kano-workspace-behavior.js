// @polymerBehavior
export const WorkspaceBehavior = {
    properties: {
        width: Number,
        height: Number,
        autoStart: Boolean,
    },
    attached() {
        if (this.autoStart) {
            this.start();
        }
    },
    start() {},
    stop() {},
    clear() {},
    renderOnCanvas() {
        return Promise.resolve();
    },
    setBackgroundColor() {},
    getBackgroundColor() {
        return 'transparent';
    },
    getRestrictElement() {
        return this;
    },
};