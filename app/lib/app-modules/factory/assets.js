import AppModule from '../app-module.js';

export const AssetsModuleFactory = (assetsRoot, stickers) => class AssetsModule extends AppModule {
    constructor() {
        super();

        this.addMethod('getSticker', '_getSticker');
        this.addMethod('randomSticker', '_randomSticker');
    }

    static get id() {
        return 'assets';
    }

    _getSticker(set, sticker) {
        return `${assetsRoot}${set}/${sticker}.svg`;
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
};

export default AssetsModuleFactory;
