import { SpeakerPart } from './speaker.js';
import { IPartAPI } from '../../api.js';
import { speaker } from '@kano/icons/parts.js';
import MetaModule, { IMetaDefinition } from '../../../meta-api/module.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { FieldSample } from './blockly/field-sample.js';
import { WebAudioTimestamp } from '../../../types.js';
import { _ } from '../../../i18n/index.js';

export function SpeakerAPIFactory(partClass : typeof SpeakerPart) : IPartAPI {
    const getter : IMetaDefinition = {
        type: 'function',
        name: 'getSample',
        verbose: '',
        parameters: [{
            type: 'parameter',
            name: 'sample',
            verbose: '',
            returnType: 'Sample',
            blockly: {
                customField() {
                    return new FieldSample(partClass.defaultSample, partClass.items);
                },
            },
        }],
        returnType: 'Sample',
        blockly: {
            toolbox: false,
            javascript(Blockly : Blockly, block : Block) {
                const value = block.getFieldValue('SAMPLE');
                return [`'${value || ''}'`, Blockly.JavaScript.ORDER_ATOMIC];
            },
        }
    };
    
    return {
        type: partClass.type,
        label: _('PART_SPEAKER_LABEL', 'Speaker'),
        icon: speaker,
        color: '#ef5284',
        symbols: [{
            type: 'function',
            name: 'play',
            verbose: _('PART_SPEAKER_PLAY', 'play'),
            parameters: [{
                type: 'parameter',
                name: 'sample',
                verbose: '',
                returnType: 'Sample',
                default: partClass.defaultSample,
                blockly: {
                    shadow(def : string, m : MetaModule) {
                        return `<shadow type="${m.def.name}_getSample"><field name="SAMPLE">${partClass.defaultSample}</field></shadow>`;
                    },
                },
            }, {
                type: 'parameter',
                name: 'time',
                returnType: Number,
                blockly: {
                    scope: WebAudioTimestamp,
                },
            }],
        }, {
            type: 'function',
            name: 'loop',
            verbose: _('PART_SPEAKER_LOOP', 'loop'),
            parameters: [{
                type: 'parameter',
                name: 'sample',
                verbose: '',
                returnType: 'Sample',
                default: partClass.defaultSample,
                blockly: {
                    shadow(def : string, m : MetaModule) {
                        return `<shadow type="${m.def.name}_getSample"><field name="SAMPLE">${partClass.defaultSample}</field></shadow>`;
                    },
                },
            }],
        }, {
            type: 'function',
            name: 'stop',
            verbose: _('PART_SPEAKER_STOP', 'stop'),
        }, {
            type: 'variable',
            name: 'pitch',
            verbose: _('PART_SPEAKER_PITCH', 'pitch'),
            setter: true,
            returnType: Number,
            default: 100,
        }, {
            type: 'variable',
            name: 'volume',
            verbose: _('PART_SPEAKER_VOLUME', 'volume'),
            setter: true,
            returnType: Number,
            default: 100,
        }, {
            type: 'function',
            name: 'randomFrom',
            verbose: _('PART_SPEAKER_RANDOM_FROM', 'random from'),
            returnType: 'Sample',
            parameters: [{
                type: 'parameter',
                name: 'set',
                verbose: '',
                returnType: 'Enum',
                enum: partClass.items.map<[string, string]>(set => [set.label, set.id]),
            }],
        }, getter],
    };
}
