/* global NeuQuant, importScripts */
importScripts('/assets/vendor/neuquant/NeuQuant.js');

var GifWorker = {};

self.onmessage = function (event) {
    var started = Date.now(),
        gifheight = event.data.height,
        gifwidth = event.data.width,
        frameData = event.data.frameData,
        job_id = event.data.job_id,
        pixels = new Uint8Array(gifwidth * gifheight),
        palette = GifWorker.generatePalette(frameData, pixels);

    if (palette.length > 256) {
        GifWorker.NeuQuantUtils.doQuant(frameData, gifwidth, gifheight);
        palette = GifWorker.generatePalette(frameData, pixels);
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

(function (GifWorker) {
    //
    //	NeuQuant
    //

    var usedEntry = new Array(), // active palette entries
        BGRpixels, // BGR byte array from frame
        indexedPixels;// converted frame indexed to palette

    GifWorker.NeuQuantUtils = {};

    GifWorker.NeuQuantUtils.doQuant = function doQuant(image, w, h) {
        var len, nPix, sample, nq, colorTab, k, j, index;
        GifWorker.NeuQuantUtils.getImagePixels(image, w, h);

        len = BGRpixels.length;
        nPix = len / 3;
        sample = 1; // default sample interval for quantizer
        indexedPixels = [];

        nq = new NeuQuant(BGRpixels, len, sample);
        colorTab = nq.process(); // create reduced palette
        // map image pixels to new palette
        k = 0;
        for (j = 0; j < nPix; j++) {
            index = nq.map(BGRpixels[k++] & 0xff, BGRpixels[k++] & 0xff, BGRpixels[k++] & 0xff);
            usedEntry[index] = true;
            indexedPixels[j] = index;
        }
        BGRpixels = null;
        GifWorker.NeuQuantUtils.setImagePixels(indexedPixels, colorTab, image, w, h);
    }

    // Extracts image pixels into byte array "pixels
    GifWorker.NeuQuantUtils.getImagePixels = function getImagePixels(data, w, h) {
        var count = 0,
            i, j, b;
        BGRpixels = [];

        for (i = 0; i < h; i++) {
            for (j = 0; j < w; j++) {
                b = (i * w * 4) + j * 4;
                BGRpixels[count++] = data[b];
                BGRpixels[count++] = data[b + 1];
                BGRpixels[count++] = data[b + 2];
            }
        }
    }

    GifWorker.NeuQuantUtils.setImagePixels = function setImagePixels(pixelArray, generatedPalette, imageDataToWrite, w, h) {
        var x, y, rgb, rgba;
        for (x = 0; x < w; x++) {
            for (y = 0; y < h; y++) {
                rgb = (x * h + y);
                rgba = (x * h + y) * 4;
                imageDataToWrite[rgba + 0] = generatedPalette[3 * pixelArray[rgb]];
                imageDataToWrite[rgba + 1] = generatedPalette[3 * pixelArray[rgb] + 1];
                imageDataToWrite[rgba + 2] = generatedPalette[3 * pixelArray[rgb] + 2];
            }
        }
    }

})(GifWorker);
