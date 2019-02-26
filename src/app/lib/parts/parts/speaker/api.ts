import { IPartAPI } from '../../api.js';
import { SpeakerPart } from './speaker.js';
import { speaker } from '@kano/icons/parts.js';
import MetaModule, { IMetaDefinition } from '../../../meta-api/module.js';
import { Block, Blockly } from '@kano/kwc-blockly/blockly.js';
import { FieldSample } from './blockly/field-sample.js';
import { WebAudioTimestamp } from '../../../types.js';

export const getter : IMetaDefinition = {
    type: 'function',
    name: 'getSample',
    parameters: [{
        type: 'parameter',
        name: 'sample',
        verbose: '',
        returnType: 'Sample',
        blockly: {
            customField() {
                return new FieldSample(SpeakerPart.defaultSample, SpeakerPart.items);
            },
        },
    }],
    returnType: 'Sample',
    toolbox: false,
    blockly: {
        postProcess(block : Block) {
            const input = block.getInput('SAMPLE');
            if (!input) {
                return;
            }
            input.removeField('PREFIX');
            input.type = Blockly.DUMMY_INPUT;
        },
        javascript(Blockly : Blockly, block : Block) {
            const value = block.getFieldValue('SAMPLE');
            return [`'${value || ''}'`];
        },
    }
};

export const SpeakerAPI : IPartAPI = {
    type: SpeakerPart.type,
    label: 'Speaker',
    icon: speaker,
    color: '#ef5284',
    symbols: [{
        type: 'function',
        name: 'play',
        parameters: [{
            type: 'parameter',
            name: 'sample',
            verbose: '',
            returnType: 'Sample',
            default: SpeakerPart.defaultSample,
            blockly: {
                shadow(def : string, m : MetaModule) {
                    return `<shadow type="${m.def.name}_getSample"><field name="SAMPLE">${SpeakerPart.defaultSample}</field></shadow>`;
                },
            },
        }, {
            type: 'parameter',
            name: 'time',
            returnType: WebAudioTimestamp,
            blockly: {
                scoped: true,
            },
        }],
    }, {
        type: 'function',
        name: 'loop',
        parameters: [{
            type: 'parameter',
            name: 'sample',
            verbose: '',
            returnType: 'Sample',
            default: SpeakerPart.defaultSample,
            blockly: {
                shadow(def : string, m : MetaModule) {
                    return `<shadow type="${m.def.name}_getSample"><field name="SAMPLE">${SpeakerPart.defaultSample}</field></shadow>`;
                },
            },
        }],
    }, {
        type: 'function',
        name: 'stop',
    }, {
        type: 'variable',
        name: 'pitch',
        setter: true,
        returnType: Number,
        default: 100,
    }, {
        type: 'variable',
        name: 'volume',
        setter: true,
        returnType: Number,
        default: 100,
    }, getter],
};