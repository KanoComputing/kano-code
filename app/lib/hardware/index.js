import HardwareAPI from './hardware-api.js';

class Hardware {
    constructor(editor) {
        this.editor = editor;
        this.api = new HardwareAPI(this.editor.config);
        this.editor.config.hardwareAPI = this.api;
        this._updateParts = this._updateParts.bind(this);
        this._requestDeviceUpdate = this._requestDeviceUpdate.bind(this);
    }
    start() {
        this.api.on('new-part-request', (e) => {
            this.editor.rootEl._newPartRequest(e);
        });
        this.editor.on('part-added', this._updateParts);
        this.editor.on('part-removed', this._updateParts);
        this.editor.on('parts-changed', this._requestDeviceUpdate);
        this._updateParts();
    }
    _updateParts() {
        this.api.setParts(this.editor.addedParts);
    }
    _requestDeviceUpdate() {
        this.api.requestDeviceUpdate();
    }
}

export default Hardware;
