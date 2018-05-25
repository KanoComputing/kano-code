import AppModule from './app-module.js';
import { stickers, generators } from '../../scripts/kano/make-apps/files/stickers.js';

class AssetsModule extends AppModule {
    constructor() {
        super();

        this.addMethod('getSticker', '_getSticker');
        this.addMethod('randomSticker', '_randomSticker');
    }

    static get name() {
        return 'assets';
    }

    _getSticker(set, sticker) {
        return generators.stickers(set, sticker);
    }

    _randomSticker(set) {
        let sets;
        if (!set) {
            sets = Object.keys(stickers);
            set = sets[Math.floor(Math.random() * sets.length)];
        }
        const stickerSet = Object.keys(stickers[set]);
        const randomSticker = stickerSet[Math.floor(Math.random() * stickers.length)];
        return this._getSticker(set, randomSticker);
    }
}

export default AssetsModule;
