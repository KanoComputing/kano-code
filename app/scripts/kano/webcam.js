(function () {
    /**
     * @namespace Kano
     */
    window.Kano = window.Kano || {}
    // Cross browser tweaks
    // Putting getUserMedia in navigator is a wrong practice, since the spec moved it inside MediaDevices
    // but calling it outside of navigator will fail on chrome
    window.MediaDevices = window.MediaDevices || {};
    if (window.MediaDevices && window.MediaDevices.getUserMedia) {
        navigator.getUserMedia = window.MediaDevices.getUserMedia;
    }
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    class Webcam {

        constructor () {
            this.video = document.createElement('video');
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.ready = new Promise((resolve, reject) => {
                this._onReady = resolve;
                this._onFail = reject;
            });
        }

        static get hasGetUserMedia() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        }

        start () {
            navigator.getUserMedia({ video: true }, this._onStreamReady.bind(this), this._onStreamFailed.bind(this));
        }

        stop () {
            if (this.stream) {
                this.stream.getVideoTracks().forEach(track => track.stop());
            }
        }

        takePicture () {
            this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
            return Promise.resolve(this.canvas.toDataURL('image/webp'));
        }

        _onStreamReady (mediaStream) {
            this.stream = mediaStream;
            this.src = window.URL.createObjectURL(mediaStream);
            this.video.src = this.src;

            this.video.onloadedmetadata = (e) => {
                this.width = this.video.videoWidth;
                this.height = this.video.videoHeight;
                this.canvas.setAttribute('width', this.width);
                this.canvas.setAttribute('height', this.height);
                this._onReady();
            };
        }

        _onStreamFailed (error) {
            this._onFail(error);
        }
    }

    Kano.Webcam = Webcam;
})();
