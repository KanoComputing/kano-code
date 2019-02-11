import { sticker } from '@kano/icons/parts.js';
import { IPartAPI } from '../../api.js';
import { StickerPart } from './sticker.js';
import { TransformAPI } from '../transform/api.js';
import { Block, Blockly } from '@kano/kwc-blockly/blockly.js';
import { FieldSticker } from './blockly/field-sticker.js';
import { IMetaDefinition } from '../../../meta-api/module.js';

const getter : IMetaDefinition = {
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
            input.removeField('PREFIX');
            input.type = Blockly.DUMMY_INPUT;
        },
        javascript(Blockly : Blockly, block : Block) {
            const value = block.getFieldValue('STICKER');
            return [`'${value || ''}'`];
        },
    }
};

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
    }, {
        type: 'function',
        name: 'random',
        returnType: 'Sticker',
    }, {
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
    }, ...TransformAPI, getter],
};
