import { MicrophoneClass } from '../microphone.js';

class MicrophoneProxyImpl extends MicrophoneClass {

    constructor () {
        super();
    }

    start () {
        // Ignore errors for now as a kit can provide volume data
        return super.start()
            .catch(e => {});
    }

    setVolumeMethod (cb) {
        this._volumeMethod = cb;
    }

    setPitchMethod (cb) {
        this._pitchMethod = cb;
    }

    getVolume () {
        this._updateVolumeDataIfNeeded();
        return this._proxiedVolume || this.volume || 0;
    }

    getPitch () {
        this._updatePitchDataIfNeeded();
        return this._proxiedPitch || this.pitch;
    }

    _updateVolumeData () {
        if (this._volumeMethod) {
            this._proxiedVolume = this._volumeMethod();
        } else {
            super._updateVolumeData();
        }
    }

    _updatePitchData () {
        if (this._pitchMethod) {
            this._proxiedPitch = this._pitchMethod();
        } else {
            super._updatePitchData();
        }
    }

    stopProxyingVolume () {
        this._volumeMethod = null;
        this._proxiedVolume = null;
    }

    stopProxyingPitch () {
        this._pitchMethod = null;
        this._proxiedPitch = null;
    }
}

// Is a singleton, all microphone proxy data is shared
export const MicrophoneProxy = new MicrophoneProxyImpl();
