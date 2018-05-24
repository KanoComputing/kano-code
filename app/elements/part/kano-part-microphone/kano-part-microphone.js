import { UIBehavior } from '../kano-ui-behavior.js';
import { microphone } from '../../../scripts/kano/make-apps/parts-api/microphone.js';
import { MicrophoneProxy } from '../../../scripts/kano/make-apps/microphone-proxy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
/* globals Polymer, Kano */

Polymer({
    is: 'kano-part-microphone',
    behaviors: [microphone, UIBehavior],
    properties: {
        model: {
            type: Object,
            notify: true
        }
    },

    ready () {
        this.reset();
    },
    attached () {
        this.remote = false;
        this.lightboard = this.appModules.getModule('lightboard');
        this._pollRemoteMic = this._pollRemoteMic.bind(this);
        MicrophoneProxy.start().catch(error => {
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
                buttonText: 'OK'
            });
        });
        clearInterval(this._remoteMicInterval);
        this._remoteMicInterval = setInterval(this._pollRemoteMic, 1000);
        this._pollRemoteMic();
    },
    detached () {
        clearInterval(this._remoteMicInterval);
        MicrophoneProxy.stop();
    },
    _pollRemoteMic () {
        let lightboards = this.lightboard.getAllLightboards(),
            remote = lightboards.length && lightboards.some(lightboard => {
                return lightboard.networkSocket && lightboard.networkSocket.connected && lightboard.product !== 'RPK';
            });
        if (!this.remote && remote) {
            MicrophoneProxy.setVolumeMethod(() => {
                return this.lightboard.getVolume();
            });
        } else if (this.remote && !remote) {
            MicrophoneProxy.stopProxyingVolume();
        }
        this.remote = remote;
    },
    start () {
        Kano.MakeApps.PartsAPI['microphone'].start.apply(this, arguments);
        this.reset();
    },
    stop () {
        Kano.MakeApps.PartsAPI['microphone'].stop.apply(this, arguments);
        this.reset();
    },
    get volume() {
        return MicrophoneProxy.getVolume();
    },
    get pitch() {
        return MicrophoneProxy.getPitch();
    },
    getvolume () {
        return this.volume;
    },
    getpitch () {
        return this.pitch;
    }
});
