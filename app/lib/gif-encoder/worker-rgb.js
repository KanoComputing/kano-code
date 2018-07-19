/* global RgbQuant, importScripts */
importScripts('/assets/vendor/rgbquant/RgbQuant.js');

var GifWorker = {};

self.onmessage = function (event) {
    var started = Date.now(),
        gifheight = event.data.height,
        gifwidth = event.data.width,
        frameData = event.data.frameData,
        job_id = event.data.job_id,
        pixels = new Uint8Array(gifwidth * gifheight),
        palette = GifWorker.generatePalette(frameData, pixels),
        q, reduced;

    if (palette.length > 64) {
        q = new RgbQuant({
            colors: 64
        });
        q.sample(frameData);
        palette = q.palette();
        reduced = q.reduce(frameData);
        palette = GifWorker.generatePalette(reduced, pixels);
    }

    palette = GifWorker.pow2Palette(palette);

    self.postMessage({
        pixels_for_gif: pixels,
        palette: palette,
        job_id: job_id,
        job_duration: Date.now() - started
    });
};

(function (GifWorker) {
    GifWorker.generatePalette = function generatePalette(frameData, pixels) {
        var palette = [],
            j, k, jl,
            r, g, b,
            color, index;
        for (j = 0, k = 0, jl = frameData.length; j < jl; j += 4, k++) {
            if (palette.length < 257) {
                r = frameData[j + 0];
                g = frameData[j + 1];
                b = frameData[j + 2];
                color = r << 16 | g << 8 | b << 0;
                index = palette.indexOf(color);
                if (index === -1) {
                    pixels[k] = palette.length;
                    palette.push(color);
                } else {
                    pixels[k] = index;
                }
            } else {
                break;
            }
        }
        return palette;
    }

    GifWorker.pow2Palette = function pow2Palette(palette) {
        var powof2 = 2;
        while (powof2 < palette.length) {
            powof2 <<= 1;
        }
        palette.length = powof2;
        return palette;
    }

})(GifWorker);
