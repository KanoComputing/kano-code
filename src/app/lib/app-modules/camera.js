import { AppModule } from './app-module.js';

export class CameraModule extends AppModule {
    constructor() {
        super();

        this.addMethod('flash', '_flash');
        this.addMethod('on', '_on');
        this.addMethod('removeListener', '_removeListener');
        this.addMethod('onPictureTaken', '_onPictureTaken');
        this.addMethod('takePicture', '_takePicture');
        this.addMethod('lastPicture', '_lastPicture');
        this.addMethod('getPicture', '_getPicture');
        this.addMethod('connect', '_connect');
    }

    static get id() { return 'camera'; }

    _flash(color, length) {
        if (this.api) {
            this.api.ledring.flash(color, length);
        }
    }

    _on() {
        if (this.api) {
            this.api.on.apply(this.api, arguments);
        }
    }

    _removeListener() {
        if (this.api) {
            this.api.removeListener.apply(this.api, arguments);
        }
    }

    _onPictureTaken(cb) {
        if (this.api) {
            this._on.call(this, 'camera:takepicture', cb);
        }
    }

    _takePicture() {
        if (this.api) {
            return this.api.camera.takePicture();
        }
        return '';
    }

    _lastPicture() {
        if (this.api) {
            return this.api.camera.lastPicture();
        }
        return '';
    }

    _getPicture(filename) {
        if (this.api) {
            return this.api.camera.getPicture(filename);
        }
        return '';
    }

    _connect(info) {
        if (this.api) {
            this.api.connect();
            this.api.on('connect', () => {
                this.api.emit('camera:init', info);
            });
        }
    }

    config(opts) {
        this.api = opts.hardwareAPI;
    }
}

export default CameraModule;
