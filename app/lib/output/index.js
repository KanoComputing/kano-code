export const OutputViewProviderMixin = base => class extends base {
    constructor(editor) {
        super();
        this.editor = editor;
    }
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
    renderOnCanvas() {
        return Promise.resolve();
    }
    getRestrictElement() {
        return this;
    }
};

export const OutputViewProvider = OutputViewProviderMixin(class {});

export default OutputViewProvider;
