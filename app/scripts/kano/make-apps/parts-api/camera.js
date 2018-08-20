import { kaleidoscope as kaleidoscope$0 } from './kaleidoscope.js';
import { filters } from './filters.js';

const Camera = {
    addFilter () {
        let args = Array.prototype.slice.call(arguments),
            name = args.shift();
        filters.addFilter.call(this, name, args);
        this._paintFrame();
    },
    clearFilters () {
        filters.clearFilters.apply(this, arguments);
        this._paintFrame();
    },
    takePicture () {
        this.throttle('takePicture', () => {
            this.appModules.getModule('camera').takePicture()
                .then((pictureUrl) => {
                    let filename = pictureUrl.split('/').pop();
                    this._onPictureTaken(this.appModules.getModule('camera').getPicture(filename));
                });
        }, 300);
    },
    _onPictureTaken (src) {
        this.lastPictureUrl = src;
        this.fire('picture-taken', src);
        this._paintFrame();
    },
    lastPicture () {
        return this.lastPictureUrl;
    },
    flash (color, length) {
        this.appModules.getModule('camera').flash(color, length);
    },
    _propagateTimerChange (data) {
        this.fire("camera-timer-" + data.direction);
    },
    _propagateButtonPress (data) {
        this.fire("camera-" + data['button-id']);
    },
    _paintFrame (src, targetCanvas, force=false) {
        // The workspace is trying to render an unsafe to share picture while exporting
        if (!src && this.safeRender) {
            return;
        }
        src = src || this.lastPictureUrl;
        targetCanvas = targetCanvas || this.canvas;
        let targetCtx = targetCanvas.getContext('2d'),
            paint;
        if (!src) {
            return;
        }
        paint = () => {
            return this._loadImage(src).then(img => {
                let width = targetCanvas.width,
                    height = targetCanvas.height,
                    finalHeight,
                    heightDiff;
                let tmpCanvas = document.createElement('canvas'),
                    tmpCtx;
                tmpCanvas.width = width;
                tmpCanvas.height =  height;
                tmpCtx = tmpCanvas.getContext('2d');
                finalHeight = width * (img.naturalHeight / img.naturalWidth);
                heightDiff = height - finalHeight;
                tmpCtx.drawImage(img, 0, heightDiff / 2, width, finalHeight);
                return this.applyFilters(tmpCanvas)
                    .then(data => {
                        targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
                        tmpCtx.putImageData(data, 0, 0);
                        this.applyKaleidoscope(tmpCanvas, targetCanvas);
                        this.fire('rendering-done');
                    });
            });
        };
        if (force) {
            return paint();
        } else {
            this.throttle('paintFrame', () => {
                paint().then(() => {});
            }, 32);
        }
    },
    _loadImage (src) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                resolve(img);
            };
            img.src = src;
        });
    },
    applyKaleidoscope (canvas, targetCanvas) {
        targetCanvas = targetCanvas || this.canvas;
        let targetCtx = targetCanvas.getContext('2d');
        if (this.kaleidoscope) {
            this.transform(targetCtx,
                            canvas,
                            targetCanvas.width,
                            targetCanvas.height,
                            targetCanvas.width,
                            targetCanvas.height,
                            this.kaleidoscope.slices,
                            this.kaleidoscope.zoom,
                            0,
                            1,
                            this.kaleidoscope.offset,
                            this.kaleidoscope.offset);
        } else {
            targetCtx.putImageData(canvas.getContext('2d').getImageData(0, 0, targetCanvas.width, targetCanvas.height), 0, 0);
        }
    },
    enableKaleidoscope (offset, slices, zoom) {
        this.kaleidoscope = {
            offset,
            slices,
            zoom
        };
        this._paintFrame();
    },
    savePicture () {},
    start () {
        kaleidoscope$0.start.apply(this, arguments);
        filters.start.apply(this, arguments);
        this.socketListeners = [];
        this.kaleidoscope = null;
        this.ctx = this.canvas.getContext('2d');

        this.appModules.getModule('camera').on('button-down', this._propagateButtonPress.bind(this));
        this.appModules.getModule('camera').on('timer-changed', this._propagateTimerChange.bind(this));
    },
    stop () {
        kaleidoscope$0.stop.apply(this, arguments);
        filters.stop.apply(this, arguments);
        this.reset();

        this.appModules.getModule('camera').removeListener('button-down', this._propagateButtonPress);
        this.appModules.getModule('camera').removeListener('timer-changed', this._propagateTimerChange);
    },
    reset () {
        if (this.socketListeners) {
            // Remove all the listeners and reset the listeners array
            this.socketListeners.forEach((listener) => {
                this.appModules.getModule('camera').removeListener(listener.name, listener.cb);
            });
        }
        this.socketListeners = [];
    }
};

/**
 * @polymerBehavior
 */
export const camera = Object.assign({}, kaleidoscope$0, filters, Camera);
