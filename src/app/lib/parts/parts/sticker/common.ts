import { IMetaDefinition } from '../../../meta-api/module.js';
import { StickerPart } from './sticker.js';
import { FieldSticker } from './blockly/field-sticker.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { _ } from '../../../i18n/index.js';

export const getter : IMetaDefinition = {
    type: 'function',
    name: 'getSticker',
    verbose: '',
    parameters: [{
        type: 'parameter',
        name: 'sticker',
        verbose: '',
        returnType: 'Sticker',
        blockly: {
            customField() {
                const items = StickerPart.items.map((item) => {
                    return {
                        id: item.id,
                        label: item.label,
                        stickers: Object.keys(item.stickers).map(id => ({ id, src: StickerPart.resolve(item.stickers[id]) })),
                    };
                });
                return new FieldSticker(StickerPart.defaultSticker, items);
            },
        },
    }],
    returnType: 'Sticker',
    blockly: {
        toolbox: false,
        javascript(Blockly : Blockly, block : Block) {
            const value = block.getFieldValue('STICKER');
            return [`'${value || ""}'`, Blockly.JavaScript.ORDER_ATOMIC];
        },
    }
};

export const random : IMetaDefinition = {
    type: 'function',
    name: 'random',
    verbose: _('PART_STICKER_RANDOM', 'random'),
    returnType: 'Sticker',
};

export const randomFrom : IMetaDefinition = {
    type: 'function',
    name: 'randomFrom',
    verbose: _('PART_STICKER_RANDOM_FROM', 'random'),
    returnType: 'Sticker',
    parameters: [{
        type: 'parameter',
        name: 'set',
        verbose: '',
        returnType: 'Enum',
        enum: StickerPart.items.map<[string, string]>(item => [item.label, item.id]),
    }],
};
