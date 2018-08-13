import KitDevice from './kit-device.js';

class Lightboard extends KitDevice {
    constructor(options, hwapi) {
        super(options, hwapi);

        this.emit('lightboard:init', {
            name: 'Make Apps',
        });

        this.NUMBER_OF_PIXELS = 128;
        this.NUMBER_OF_CHANNELS = 2;
    }

    // TODO: this method should be added in some global object so that we can reuse it
    isValidColourFormat(colour) {
        return (typeof colour === 'string' && colour.length === 7 && /#[0-9a-f]{6}/i.test(colour));
    }

    // TODO: this method should be added in some global object so that we can reuse it
    colorHexToRGB565(colour) {
        let rgb888,
            rgb565,
            retBuf = new window.buffer.Buffer(2);

        if (!this.isValidColourFormat(colour)) {
            retBuf.writeUInt16BE(0x0000, 0);
            return retBuf;
        }
        rgb888 = parseInt(colour.substring(1, 7), 16);
        //                blue                 green                  red
        rgb565 = (rgb888 & 0xF8) >> 3 | (rgb888 & 0xFC00) >> 5 | (rgb888 & 0xF80000) >> 8;

        retBuf.writeUInt16BE(rgb565, 0);
        return retBuf;
    }

    encodeBitmap(bitmap) {
        let _colourBin,
            _internalRepresentation = new window.buffer.Buffer(this.NUMBER_OF_PIXELS * this.NUMBER_OF_CHANNELS);

        for (let pxlIndex = 0; pxlIndex < bitmap.length; pxlIndex++) {
            _colourBin = this.colorHexToRGB565(bitmap[pxlIndex]);
            _colourBin.copy(_internalRepresentation, pxlIndex * this.NUMBER_OF_CHANNELS);
        }

        return _internalRepresentation.toString('base64');
    }

    drawBitmap(bitmap) {
        if (this.product == 'RPK') {
            this.emit('lightboard:on', { map: this.encodeBitmap(bitmap) });
        } else {
            this.emit('lightboard:on', { pixels: bitmap });
        }
    }
}

export default Lightboard;
