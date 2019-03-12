import { IMetaDefinition } from '../../../meta-api/module.js';
import { StickerPart } from './sticker.js';
import { FieldSticker } from './blockly/field-sticker.js';
import { Block, Blockly } from '@kano/kwc-blockly/blockly.js';

export const getter : IMetaDefinition = {
    type: 'function',
    name: 'getSticker',
    parameters: [{
        type: 'parameter',
        name: 'sticker',
        verbose: '',
        returnType: 'Sticker',
        blockly: {
            customField() {
                const items = StickerPart.items.map((item) => {
                    return {
                        label: item.label,
                        stickers: Object.keys(item.stickers).map(id => ({ id, src: StickerPart.resolve(item.stickers[id]) })),
                    };
                });
                return new FieldSticker(StickerPart.defaultSticker, items);
            },
        },
    }],
    returnType: 'Sticker',
    toolbox: false,
    blockly: {
        postProcess(block : Block) {
            const input = block.getInput('STICKER');
            if (!input) {
                return;
            }
            input.type = Blockly.DUMMY_INPUT;
        },
        javascript(Blockly : Blockly, block : Block) {
            const value = block.getFieldValue('STICKER');
            return [`'${value || ''}'`];
        },
    }
};

export const random : IMetaDefinition = {
    type: 'function',
    name: 'random',
    returnType: 'Sticker',
};

export const randomFrom : IMetaDefinition = {
    type: 'function',
    name: 'randomFrom',
    verbose: 'random',
    returnType: 'Sticker',
    parameters: [{
        type: 'parameter',
        name: 'set',
        verbose: '',
        returnType: 'Enum',
        enum: StickerPart.items.map<[string, string]>(item => [item.label, item.id]),
    }],
};
