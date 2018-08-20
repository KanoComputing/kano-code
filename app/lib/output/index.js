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

export default OutputViewProvider;
