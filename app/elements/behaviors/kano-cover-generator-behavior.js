import { GifEncoder } from '../../scripts/kano/gif-encoder/encoder.js';

// @polymerBehavior
export const CoverGeneratorBehavior = {
    generateCover (workspace, parts, width, height, scale=1, padding=0, background='#ffffff') {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            rect = workspace.getBoundingClientRect(),
            scaleFactor = rect.width / width,
            util = {
                getStyle: this.getStyle,
                roundRect: this.roundRect
            },
            image,
            promise;

        canvas.id = 'screenshot';
        canvas.width  = width;
        canvas.height = height;

        //setting background color
        ctx.fillStyle = workspace.getBackgroundColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        promise = this.renderOnCanvas(workspace, ctx, util, scaleFactor);
        parts.forEach((part) => {
            let el = workspace.querySelector(`#${part.id}`);
            if (typeof el.renderOnCanvas === 'function') {
                promise = promise.then(() => {
                    return el.renderOnCanvas(ctx, util, scaleFactor);
                });
            }
        });
        return promise.then(() => {
            let tmpCanvas = document.createElement('canvas'),
                tmpCtx;
            tmpCanvas.width = width * scale;
            tmpCanvas.height = height * scale;
            tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.drawImage(canvas, 0, 0, tmpCanvas.width, tmpCanvas.height);
            return tmpCanvas;
        });
    },
    generateAnimationSpriteSheet (animation) {
        let sheet = document.createElement('canvas'),
            ctx = sheet.getContext('2d'),
            fw = 16,
            fh = 8,
            pixelSize = 1;
        animation.bitmaps.forEach((bitmap, bitmapIndex) => {
            bitmap.forEach((pixel, i) => {
                let fX = i % fw,
                    fY = Math.floor(i / fw),
                    sX = fw * pixelSize * bitmapIndex + fX * pixelSize,
                    sY = fY * pixelSize;

                ctx.beginPath();
                ctx.rect(sX, sY, pixelSize, pixelSize);
                ctx.fillStyle = pixel;
                ctx.fill();
            });
        });
        return Promise.resolve(sheet.toDataURL("image/png"));
    },
    generateAppSpriteSheet (workspace, fps, duration) {
        /* Only works for the lightboard workspace */
        if (!workspace || !workspace.bitmap) {
            return Promise.resolve();
        }

        let length = Math.round(duration * fps),
            sheet = document.createElement('canvas'),
            ctx = sheet.getContext('2d'),
            frame = 0,
            interval = 1000 / fps,
            fw = 16,
            fh = 8,
            pixelSize = 1;

        ctx.canvas.width = fw * pixelSize * length;
        ctx.canvas.height = fh * pixelSize;

        this.gifProgress = 0;
        this.gifRenderProgress = 0;
        this.interrupted = false;

        return new Promise((resolve, reject) => {
            let renderSprite = () => {
                let bitmap = workspace.bitmap;

                bitmap.forEach((pixel, i) => {
                    let fX = i % fw,
                        fY = Math.floor(i / fw),
                        sX = fw * pixelSize * frame + fX * pixelSize,
                        sY = fY * pixelSize;

                    ctx.beginPath();
                    ctx.rect(sX, sY, pixelSize, pixelSize);
                    ctx.fillStyle = pixel;
                    ctx.fill();
                });

                if (frame < length) {
                    frame++;
                    this.gifProgress += 100 / length;
                    this.gifRenderProgress += 100 / length;
                    if (!this.interrupted) {
                        setTimeout(renderSprite, interval);
                    }
                } else {
                    resolve(sheet.toDataURL("image/png"));
                }
            };

            // To skip the first empty frames
            setTimeout(renderSprite, 2000);
        });
    },
    generateAnimationSpritesheet (frames) {
        let sheet = document.createElement('canvas'),
            ctx = sheet.getContext('2d'),
            fw = 16,
            fh = 8,
            pixelSize = 1;

        frames.forEach((bitmap, frameNumber) => {
            bitmap.forEach((pixel, i) => {
                let fX = i % fw,
                    fY = Math.floor(i / fw),
                    sX = fw * pixelSize * frameNumber + fX * pixelSize,
                    sY = fY * pixelSize;

                ctx.beginPath();
                ctx.rect(sX, sY, pixelSize, pixelSize);
                ctx.fillStyle = pixel;
                ctx.fill();
            });
        });

        return sheet.toDataURL("image/png");
    },
    base64toBlob (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data),
            byteArrays = [],
            slice, byteNumbers,
            byteArray, offset;

        for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            slice = byteCharacters.slice(offset, offset + sliceSize);

            byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    },
    renderOnCanvas (workspace, ctx, util, scaleFactor) {
        if (!workspace || !workspace.renderOnCanvas) {
            return Promise.resolve();
        }
        workspace.safeRender = true;
        return workspace.renderOnCanvas(ctx, util, scaleFactor).then(_ => {
            workspace.safeRender = false;
            return _;
        });
    },
    _generateGifCover (workspace, parts, scale, padding, color, fps, length) {
        this.interrupted = false;
        let encoder = new GifEncoder({
            width: workspace.width * scale,
            height: workspace.height * scale,
            length,
            workerUrl: '/scripts/kano/gif-encoder/worker-rgb.js'
        });
        let wait = (delay) => {
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, delay);
                });
            },
            p = wait(300);

        let getFrame = () => {
            return this.generateCover(workspace,
                                        parts,
                                        workspace.width,
                                        workspace.height,
                                        scale,
                                        padding,
                                        color)
                .then(canvas => {
                    encoder.addFrame(canvas.getContext('2d'), 1000 / fps);
                    this.gifProgress += (100 / length);
                    if (!this.interrupted) {
                        return wait(1000 / fps);
                    }
                });
        }
        this.gifProgress = 0;
        this.gifRenderProgress = 0;
        for (let i = 0; i < length; i++) {
            p = p.then(getFrame.bind(this));
        }
        return p.then(_ => {
            return encoder.end();
        })
        .then(blob => {
            this.gifProgress = 0;
            this.gifRenderProgress = 0;
            return blob;
        });
    },
    /**
     * Helper to get style from element
     * @param  {Object} element  DOM element you want to inspect
     * @param  {String} css_rule CSS rule you want to get
     * @return {String} value of the css_rule for the DOM element
     */
    getStyle (element, css_rule) {
        var strValue = "";
        if (!element) {
            return strValue;
        }
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(element, "").getPropertyValue(css_rule);
        } else if (element.currentStyle) {
            css_rule = css_rule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = element.currentStyle[css_rule];
        }
        return strValue;
    },
    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    roundRect (ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }

    }
};