import { IMetaDefinition } from '../../meta-api/module.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { StampsField } from '../../blockly/fields/stamps-field.js';
import { defaultStamp, stamps } from './data.js';
import { resolve } from '../../util/image-stamp.js';
import { _ } from '../../i18n/index.js';


const getImage : IMetaDefinition = {
    type: 'function',
    name: 'getImage',
    verbose: '',
    parameters: [{
        type: 'parameter',
        name: 'sticker',
        verbose: '',
        returnType: 'Sticker',
        blockly: {
            customField() {
                const images = stamps.map((image) => {
                    return {
                        id: image.id,
                        label: image.label,
                        stickers: Object.keys(image.stickers).map(id => ({ id, src: resolve(image.stickers[id])})),
                    };
                });
                return new StampsField(defaultStamp, images);
            },
        },
    }],
    returnType: 'Sticker',
    blockly: {
        toolbox: false,
        javascript(Blockly : Blockly, block: Block) {
            const value = block.getFieldValue('STICKER');
            return [`'${value || ""}'`, Blockly.JavaScript.ORDER_ATOMIC];
        },
    }
};

export const random : IMetaDefinition = {
    type: 'function', 
    name: 'random',
    verbose: _('PART_STICKER_RANDOM', 'random'),
    returnType: 'Sticker'
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
        enum: stamps.map<[string, string]>(stamp => [stamp.label, stamp.id]),
    }]
}

function hideBlock(block : IMetaDefinition) {
    const newBlock = Object.assign({}, block);
    newBlock.blockly = { toolbox: false };
    return newBlock;
}

export const StampAPI = {
    type: 'module',
    name: 'stamp',
    verbose: 'Stamp',
    color: '#00c7b6',
    symbols: [
        getImage,
        hideBlock(random),
        hideBlock(randomFrom)
    ]
}

export default StampAPI;
