import AppModule from './app-module.js';

class MicModule extends AppModule {
    constructor() {
        super();

        this.addLifecycleStep('stop', '_stop');

        this.addMethod('getAudioStream', '_getAudioStream');
        this.addMethod('on', '_on');
        this.addMethod('removeListener', '_removeListener');
        this.addMethod('getVolume', '_getVolume');
        this.addMethod('getPitch', '_getPitch');
    }

    static get name() { return 'mic'; }

    _getAudioStream() {
        if (this.api) {
            return this.api.microphone.getAudioStream();
        }
    }

    _getVolume() {
        if (this.api) {
            return this.api.microphone.getVolume();
        }
    }

    _getPitch() {
        return this.api.microphone.getPitch();
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

    _stop() {
        if (this.api && this.api.microphone && typeof this.api.microphone.stopRecording === 'function') {
            this.api.microphone.stopRecording();
        }
    }

    config(opts) {
        this.api = opts.hardwareAPI;
    }
}

export default MicModule;
