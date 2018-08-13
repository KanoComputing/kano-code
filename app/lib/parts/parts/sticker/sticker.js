import { BaseMixin } from '../../base.js';
import { StickerResolver } from './resolver.js';

export const StickerMixin = base => class extends BaseMixin(base) {
    getSticker(set, sticker) {
        const { assetsRoot } = this.model.config;
        return StickerResolver.resolve(assetsRoot, set, sticker);
    }
    setSticker(pic) {
        if (pic) {
            this.set('model.userProperties.src', pic);
        }
    }
    getSource() {
        return this.get('model.userProperties.src');
    }
    randomSticker(fromSet) {
        let sets;
        let set = fromSet;
        const stickerSet = this.model.config.stickers;
        if (!set) {
            sets = Object.keys(stickerSet);
            set = sets[Math.floor(Math.random() * sets.length)];
        }
        const stickers = Object.keys(stickerSet[set]);
        const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
        return this.getSticker(set, randomSticker);
    }
};

export default StickerMixin;
