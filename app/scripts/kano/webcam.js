(function (Kano) {
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
            this.cameraIds = [];
        }

        static get hasGetUserMedia() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        }

        start () {
            // CES hack
            this.scanCameras();

        }

        stop () {
            if (this.stream) {
                this.stream.getVideoTracks().forEach(track => track.stop());
            }
        }

        scanCameras () {
            navigator.mediaDevices.enumerateDevices()
                .then(deviceInfos => {
                    for (var i = 0; i !== deviceInfos.length; i++) {
                        var deviceInfo = deviceInfos[i];

                        // Put the Stereo Vision camera (Kano kit) as the first item of the cameraIds array
                        if (deviceInfo.kind === 'videoinput' && /Stereo Vision/.test(deviceInfo.label)) {
                            this.cameraIds.unshift(deviceInfo.deviceId);

                            // Log result for CES demo
                            console.log('Sterevision detected, deviceId:', deviceInfo.deviceId);
                        } else if (deviceInfo.kind === 'videoinput') {
                            this.cameraIds.push(deviceInfo.deviceId);
                        }
                    }
                    this.connectToCamera();
                })
                .catch(error => {
                    this._onStreamFailed(error);
                });
        }

        connectToCamera () {
            let selectedCameraId = this.cameraIds[0];

            // Trying to connect otherwise go to next cameraId
            navigator.getUserMedia(
                { video: { deviceId: {exact: selectedCameraId} } },
                this._onStreamReady.bind(this), this._onCameraConnectFailed.bind(this));
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

        _onCameraConnectFailed (error) {

            // Take the first out from the detected camera array, and scan again
            this.cameraIds.splice(0, 1);
            if (this.cameraIds.length > 0) {
                this.connectToCamera();
            } else {
                this._onStreamFailed(error);
            }
        }

        _onStreamFailed (error) {
            this._onFail(error);
        }
    }

    Kano.Webcam = Webcam;
})(window.Kano = window.Kano || {});
