// @polymerBehavior
export const LightBitmapBehavior = {
    _adjustForStorage (bitmap, width) {
        let newBitmap = [];

        for (let i = 0; i < 128; i++) {
            newBitmap.push('#000000');
        }

        bitmap.forEach((color, i) => {
            let x = i % width,
                y = Math.floor(i / width),
                storedPos = x + y * 16;
            if (storedPos < 128) {
                newBitmap[storedPos] = color;
            }
        });
        return newBitmap;
    },
    _adjustForDisplay (bitmap, width, height) {
        let newBitmap = [];

        for (let i = 0; i < height * width; i++) {
            newBitmap.push('#000000');
        }

        bitmap.forEach((color, i) => {
            let x = i % 16,
                y = Math.floor(i / 16),
                realPos = x + y * width;
            if (realPos < newBitmap.length) {
                newBitmap[realPos] = color;
            }
        });
        return newBitmap;
    }
};
