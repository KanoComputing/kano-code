import { sticker } from '@kano/icons/parts.js';
import { IPartAPI } from '../../api.js';
import { StickerPart } from './sticker.js';
import { TransformAPI } from '../transform/api.js';
import { getter, random, randomFrom } from './common.js';

export const StickerAPI : IPartAPI = {
    type: StickerPart.type,
    label: 'Sticker',
    icon: sticker,
    color: '#00c7b6',
    symbols: [{
        type: 'variable',
        name: 'image',
        setter: true,
        getter: false,
        returnType: 'Sticker',
        default: StickerPart.defaultSticker,
        blockly: {
            shadow(def : string) {
                return `<shadow type="sticker_getSticker"><field name="STICKER">${StickerPart.defaultSticker}</field></shadow>`;
            },
        },
    }, random, randomFrom, ...TransformAPI, getter],
};
