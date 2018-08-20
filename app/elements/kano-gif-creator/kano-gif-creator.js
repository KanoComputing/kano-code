import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import 'gif.js/dist/gif.js';

Polymer({
    _template: html`
        <style>
            :host {
                display: block;
            }
            canvas {
                width: 100%;
                height: 100%;
            }
        </style>
        <canvas id="canvas" width\$="[[width]]" height\$="[[height]]"></canvas>
`,

    is: 'kano-gif-creator',

    properties: {
        pictures: {
            type: Array,
            value: () => [],
        },
        framerate: {
            type: Number,
            value: 15,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
    },

    observers: [
        '_picturesChanged(pictures.splices)',
    ],

    ready() {
        this.frameId = 0;
        this.ctx = this.$.canvas.getContext('2d');
    },

    getCanvas() {
        return this.$.canvas;
    },

    _picturesChanged() {
        this._paintFrame(this.pictures[this.pictures.length - 1]);
    },

    _updateFrame() {
        this.frameId++;
        if (this.frameId >= this.pictures.length) {
            this.frameId = 0;
        }
        this.frame = this.pictures[this.frameId];
        this._paintFrame(this.frame);
        this.timeoutId = setTimeout(this._updateFrame.bind(this), 1000 / this.framerate);
    },

    play() {
        this._updateFrame();
    },

    pause() {
        clearInterval(this.timeoutId);
    },

    setTransformer(cb) {
        this._transformer = cb;
    },

    _paintFrame(src) {
        let img = new Image(),
            width = this.$.canvas.width,
            height = this.$.canvas.height,
            finalHeight,
            heightDiff;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            let tmpCanvas = document.createElement('canvas'),
                tmpCtx;
            tmpCanvas.setAttribute('width', width);
            tmpCanvas.setAttribute('height', height);
            tmpCtx = tmpCanvas.getContext('2d');
            finalHeight = width * (img.naturalHeight / img.naturalWidth);
            heightDiff = height - finalHeight;
            tmpCtx.drawImage(img, 0, heightDiff / 2, width, finalHeight);
            if (this._transformer) {
                this._transformer(tmpCanvas).then((data) => {
                    this.ctx.putImageData(data, 0, 0);
                });
            } else {
                this.ctx.clearRect(0, 0, width, height);
                this.ctx.drawImage(img, 0, heightDiff / 2, width, finalHeight);
            }
        };
        img.src = src;
    },

    _createGif() {
        let gif = new GIF({
                workers: 2,
                quality: 10,
                workerScript: '/scripts/workers/gif.worker.js',
            }),
            promises;
        promises = this.pictures.map((url) => new Promise((resolve, reject) => {
              let img = new Image();
              img.crossOrigin = 'Anonymous';
              img.onload = () => {
                  resolve(img);
              };
              img.onerror = (e) => {
                  reject(e);
              };
              img.src = url;
          }));
        return Promise.all(promises).then((images) => new Promise((resolve, reject) => {
              images.forEach((image) => {
                  gif.addFrame(image, { delay: 1000 / this.framerate });
              });
              gif.on('finished', (blob) => {
                  resolve(blob);
              });
              gif.render();
          }));
    },

    downloadGif() {
        this._createGif().then((blob) => {
            let a = document.createElement('a'),
                url;
            a.style.display = 'none';
            url = URL.createObjectURL(blob);
            a.href = url;
            a.download = 'my-gif.gif';
            a.click();
            URL.revokeObjectURL(url);
        });
    },
});
