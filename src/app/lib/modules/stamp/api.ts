import { IMetaDefinition } from '../../meta-api/module.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { StampsField } from '../../blockly/fields/stamps-field.js';
import { _ } from '../../i18n/index.js';
import { Editor } from '../../editor/editor.js';
import { random } from './common.js';

function getImage(editor : Editor) : IMetaDefinition {
    return {
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
                    const stickers = editor.output.resources.get('stickers');
                    if (!stickers) {
                        throw new Error('Could not create StampsField: stickers resource is not defined');
                    }
                    const defaultSticker = stickers.default ? stickers.default : ''
                    return new StampsField(defaultSticker, stickers.categorisedResource);
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
    }
};

function hideBlock(block : IMetaDefinition) {
    const newBlock = Object.assign({}, block);
    newBlock.blockly = { toolbox: false };
    return newBlock;
}

export function StampAPI (editor: Editor) {
    return {
        type: 'module',
        name: 'stamp',
        verbose: 'Stamp',
        color: '#00c7b6',
        symbols: [
            getImage(editor),
            hideBlock(random(editor)),
        ]
    }
}

export default StampAPI;
