import { generators, stickers as stickers$0 } from '../files/stickers.js';
import { Base } from './base.js';

const Sticker = {
    getSticker (set, sticker) {
        return generators.stickers(set, sticker);
    },
    setSticker (pic) {
        if (pic) {
            this.set('model.userProperties.src', pic);
        }
    },
    getSource () {
        return this.get('model.userProperties.src');
    },
    randomSticker (set) {
        let randomSticker, stickers, sets;
        if (!set) {
            sets = Object.keys(stickers$0),
            set = sets[Math.floor(Math.random() * sets.length)];
        }
        stickers = Object.keys(stickers$0[set]);
        randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
        return this.getSticker(set, randomSticker);
    }
};

/**
 * @polymerBehavior
 */
export const sticker = Object.assign({}, Base, Sticker);
