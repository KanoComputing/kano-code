import { WorkspaceBehavior } from '../behaviors/kano-workspace-behavior.js';
import { UIBehavior } from '../part/kano-ui-behavior.js';
import { camera } from '../../scripts/kano/make-apps/parts-api/camera.js';
import '../ui/kano-ui/kano-ui-camera.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
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

export { Webcam };
/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                @apply --layout-vertical;
            }
            :host ::slotted(*) {
                position: absolute;
                top: 0px;
                left: 0px
            }
            .canvas {
                position: relative;
                width: 100%;
                height: 100%;
                background: var(--canvas-background, #ffffff);
                border-radius: 5px;
            }
            :host #canvas, :host .content {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
            }
            :host button {
                @apply --kano-button;
                @apply --layout-self-end;
                background-color: var(--color-green, green);
            }
            :host canvas,
            :host .content {
                border-radius: 5px;
            }
        </style>
        <button on-tap="_triggerShutterEvent">Shutter</button>
        <div class="canvas">
            <canvas id="canvas" width\$="[[width]]" height\$="[[height]]"></canvas>
            <div class="content">
                <slot></slot>
            </div>
        </div>
`,

  is: 'kano-workspace-camera',
  behaviors: [WorkspaceBehavior, UIBehavior, camera],

  listeners: {
      'play-picture-list': '_playPictureList',
      'pause-picture-list': '_pausePictureList',
      'save-gif': '_saveGifFromPictureList'
  },

  ready () {
      // Will contain the listeners attached to the socket
      this.pictures = [];
      this.framerate = 15;
      this.canvas = this.$.canvas;
  },

  setBackgroundColor (color) {
      this.$.canvas.style.background = color;
  },

  attached () {
      this.connected = false;
      // Wait for the socket to try to connect
      setTimeout(() => {
          // Still not connected, start the webcam
          if (!this.connected) {
              this._startWebcam();
          }
      }, 300);
      Kano.AppModules.getModule('camera').connect({
          name: 'Kano Code'
      });
      Kano.AppModules.getModule('camera').on('connect', () => {
          this.connected = true;
          // Stop the webcam if started before
          this._stopWebcam();
      });
      Kano.AppModules.getModule('camera').on('disconnect', () => {
          this.connected = false;
          this._startWebcam();
      });
  },

  _playPictureList (e) {
      let detail = e.detail;

      // Stop picture list if it was previously playing
      this._pausePictureList();

      this.frameId = 0;
      this.pictures = detail.pictures;
      this.speed = detail.speed;

      this._updateFrame();
  },

  _saveFile (src, name) {
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.download = name;
      a.href = src;
      a.click();
      document.body.removeChild(a);
  },

  _updateFrame () {
      if (this.pictures.length > 0) {
          this._paintFrame(this.pictures[this.frameId]);
          this.frameId++;
          if (this.frameId > this.pictures.length - 1) {
              this.frameId = 0;
          }
      }
      this.playingId = setTimeout(this._updateFrame.bind(this), 1000 / Math.max(1, this.speed));
  },

  _pausePictureList (e) {
      if (this.playingId) {
          clearTimeout(this.playingId);
          this.playingId = null;
          this.pictures = [];
      }
  },

  _startWebcam () {
      this.webcam = new Webcam();
      this.webcam.ready.then(_ => {
          if (this.connected) {
              this._stopWebcam();
              return;
          }
      }).catch(e => {
          if (e.name === 'PermissionDeniedError') {
              this.fire('kano-error', {
                  text: `Kano Code needs permission to use your webcam. You can allow access from your browser settings.`,
                  duration: 0,
                  closeWithButton: true,
                  buttonText: 'OK'
              });
          }
      });
      this.webcam.start();
  },

  _stopWebcam () {
      this.webcam.stop();
      this.webcam = null;
  },

  takePicture () {
      if (this.webcam) {
          this.throttle('takePicture', () => {
              this.webcam.takePicture().then(url => {
                  this._onPictureTaken(url);
              });
          }, 300);
      } else {
          camera.takePicture.apply(this);
      }
  },

  savePicture () {
      // If this method ends up in a loop, make sure only one dowload happens every second
      this.throttle('savePicture', () => {
          let src = this.canvas.toDataURL('image/jpeg');
          this._saveFile(url, 'kano-code-picture.jpg');
      }, 1000);
  },

  _saveGifFromPictureList (e) {
      let pictures = e.detail.pictures,
          canvases = [],
          speed = e.detail.speed,
          tasks = Promise.resolve();

      for (let i = pictures.length; i >= 0; i--) {
          tasks = tasks.then(_ => {
              let tmpCanvas = document.createElement('canvas');
              tmpCanvas.width = this.width;
              tmpCanvas.height = this.height;
              return this._paintFrame(pictures[i], tmpCanvas, true)
                  .then(_ => canvases.push(tmpCanvas));
          });
      }

      tasks.then(_ => {
          return new Promise((resolve, reject) => {
              let gif = new GIF({
                  workers: 2,
                  quality: 100,
                  workerScript: '/scripts/workers/gif.worker.js'
              });
              canvases.forEach(canvas => {
                  gif.addFrame(canvas, { delay: 1000 / speed });
              });
              gif.on('finished', (blob) => {
                  resolve(blob);
              });
              gif.render();
          });
      }).then(blob => {
          let url = URL.createObjectURL(blob);
          this._saveFile(url, 'kano-code-gif.gif');
      });
  },

  clear () {
      this.pictures = [];
      this.frameId = 0;
  },

  stop () {
      this._pausePictureList();
      camera.stop.apply(this, arguments);
      this.reset();
  },

  reset () {
      this._pausePictureList();
      this.renderBlank();
  },

  // Support legacy code
  getCamera () {
      return this;
  },

  detached () {
      this._pausePictureList();
      this._stopWebcam();
  },

  renderBlank () {
      let ctx = this.$.canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.clearRect(0, 0, this.$.canvas.width, this.$.canvas.height);
  },

  renderOnCanvas (ctx, util, scaleFactor) {
      return new Promise((resolve, reject) => {
          let img = new Image(),
              randomIndex = Math.floor(Math.random() * 3);
          img.onload = () => {
              ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
              resolve();
          }
          img.onerror = reject;
          img.src = `/assets/mode/camera/placeholder_${randomIndex}.jpg`;
      });
  },

  _triggerShutterEvent () {
      this.fire('camera-shutter-button');
  }
});
