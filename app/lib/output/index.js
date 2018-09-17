export const OutputViewProviderMixin = base => class extends base {
    start() {}
    stop() {}
    onInstall(output) {
        this.output = output;
    }
    onInject() {}
    onImport() {}
    onExport(data) {
        return data;
    }
    onCreationImport() {}
    onCreationExport(data) {
        return data;
    }
    render() {}
    getRestrictElement() {
        return this;
    }
    onDispose() {}
};

export const OutputViewProvider = OutputViewProviderMixin(class {});

export const OutputElementMixin = base => class extends base {
    static get properties() {
        return {
            width: Number,
            height: Number,
            autoStart: Boolean,
        };
    }
    attached() {
        if (this.autoStart) {
            this.start();
        }
    }
    start() {}
    stop() {}
    clear() {}
    renderOnCanvas() {
        return Promise.resolve();
    }
    setBackgroundColor() {}
    getBackgroundColor() {
        return 'transparent';
    }
    getRestrictElement() {
        return this;
    }
};

export default OutputViewProvider;
