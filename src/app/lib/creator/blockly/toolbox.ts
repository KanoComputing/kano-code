import { Blockly, Block } from '@kano/kwc-blockly/blockly.js';
import { TextareaField } from './textarea.js';
import { IAPIDefinition } from '../../meta-api/module.js';

export const BlocklyCreatorToolbox : IAPIDefinition = {
    type: 'module',
    name: 'generator',
    verbose: 'Challenge',
    color: '#676767',
    symbols: [{
        type: 'function',
        name: 'id',
        verbose: 'Challenge id',
        parameters: [{
            type: 'parameter',
            name: 'id',
            verbose: '',
            default: 'challenge-id',
            returnType: String,
            blockly: {
                field: true,
            },
        }],
        blockly: {
            javascript(Blockly : Blockly, block : Block) {
                const text = block.getFieldValue('ID');
                return `// @challenge-id: ${text}\n`;
            },
            postProcess(block : Block) {
                block.setPreviousStatement(false);
                block.setNextStatement(false);
            },
        },
    }, {
        type: 'function',
        name: 'banner',
        parameters: [{
            type: 'parameter',
            name: 'text',
            default: 'Banner content',
            returnType: String,
            blockly: {
                field: true,
            },
        }],
        blockly: {
            javascript(Blockly : Blockly, block : Block) {
                const bannerText = block.getFieldValue('TEXT');
                return `// @banner: ${bannerText}\n`;
            },
        },
    }, {
        type: 'function',
        name: 'start',
        blockly: {
            javascript(Blockly : Blockly) {
                return '// @challenge-start\n';
            },
        },
    }, {
        type: 'function',
        name: 'step',
        parameters: [{
            type: 'parameter',
            name: 'json',
            returnType: String,
            blockly: {
                customField() {
                    return new TextareaField(`{
    
}`);
                },
            },
        }],
        blockly: {
            javascript() {
                return '// @step\n';
            },
        },
    }, {
        type: 'function',
        name: 'metadata',
        parameters: [{
            type: 'parameter',
            name: 'json',
            returnType: String,
            blockly: {
                customField() {
                    return new TextareaField(`{
    
}`);
                },
            },
        }],
        blockly: {
            javascript() {
                return '// @metadata\n';
            },
            postProcess(block : Block) {
                block.setPreviousStatement(false);
                block.setNextStatement(false);
            },
        },
    }],
}