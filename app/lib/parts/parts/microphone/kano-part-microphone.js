import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { MicrophoneMixin } from './microphone.js';
import { MicrophoneProxy } from '../../../../scripts/kano/make-apps/microphone-proxy.js';

class KanoPartMicrophone extends MicrophoneMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-part-microphone'; }
    static get properties() {
        return {
            model: {
                type: Object,
                notify: true,
            },
        };
    }
    constructor() {
        super();
        this.reset();
    }
    connectedCallback() {
        super.connectedCallback();
        this.remote = false;
        if (this.appModules) {
            this.lightboard = this.appModules.getModule('lightboard');
        }
        this._pollRemoteMic = this._pollRemoteMic.bind(this);
        MicrophoneProxy.start().catch((error) => {
            let message;
            if (error.name === 'PermissionDeniedError') {
                message = 'Kano Code needs permission to use your microphone. You can allow access from your browser settings.';
            } else if (error.name === 'DevicesNotFoundError') {
                message = 'No microphone was found. The microphone part has been disabled.';
            } else {
                message = 'Your browser doesn\'t support audio input. The microphone part has been disabled.';
            }
            this.fire('kano-error', {
                text: message,
                duration: 0,
                closeWithButton: true,
                buttonText: 'OK',
            });
        });
        clearInterval(this._remoteMicInterval);
        this._remoteMicInterval = setInterval(this._pollRemoteMic, 1000);
        this._pollRemoteMic();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this._remoteMicInterval);
        MicrophoneProxy.stop();
    }
    _pollRemoteMic() {
        if (!this.lightboard) {
            return;
        }
        const lightboards = this.lightboard.getAllLightboards();
        const remote = lightboards.length && lightboards.some(lightboard => lightboard.networkSocket && lightboard.networkSocket.connected && lightboard.product !== 'RPK');
        if (!this.remote && remote) {
            MicrophoneProxy.setVolumeMethod(() => this.lightboard.getVolume());
        } else if (this.remote && !remote) {
            MicrophoneProxy.stopProxyingVolume();
        }
        this.remote = remote;
    }
    start(...args) {
        super.start(...args)
        this.reset();
    }
    stop(...args) {
        super.stop(...args)
        this.reset();
    }
    get volume() {
        return MicrophoneProxy.getVolume();
    }
    get pitch() {
        return MicrophoneProxy.getPitch();
    }
    getvolume() {
        return this.volume;
    }
    getpitch() {
        return this.pitch;
    }
}

customElements.define(KanoPartMicrophone.is, KanoPartMicrophone);
