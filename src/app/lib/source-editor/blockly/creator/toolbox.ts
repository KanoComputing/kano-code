import { Block } from '@kano/kwc-blockly/blockly.js';
import { IAPIDefinition } from '../../../meta-api/module.js';

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
        },
    }, {
        type: 'function',
        name: 'name',
        verbose: 'Challenge name',
        parameters: [{
            type: 'parameter',
            name: 'name',
            verbose: '',
            default: 'Challenge Name',
            returnType: String,
            blockly: {
                field: true,
            },
        }],
        blockly: {
            javascript(Blockly : Blockly, block : Block) {
                const text = block.getFieldValue('NAME');
                return `// @challenge-name: ${text}\n`;
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
        name: 'banner',
        parameters: [{
            type: 'parameter',
            name: 'text',
            verbose: '',
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
        name: 'challengeEnd',
        verbose: 'end of challenge',
        parameters: [{
            type: 'parameter',
            name: 'text',
            verbose: '',
            default: 'content',
            returnType: String,
            blockly: {
                field: true,
            },
        }],
        blockly: {
            javascript(Blockly : Blockly, block : Block) {
                const bannerText = block.getFieldValue('TEXT');
                return `// @end-of-challenge: ${bannerText}\n`;
            },
        },
    }, {
        type: 'function',
        name: 'step',
        verbose: 'custom step',
        blockly: {
            javascript() {
                return '// @step\n';
            },
        },
    }],
}