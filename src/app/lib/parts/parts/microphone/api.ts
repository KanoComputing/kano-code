import { IPartAPI } from '../../api.js';
import { MicrophonePart } from './microphone.js';
import { microphone } from '@kano/icons/parts.js';
import { MicrophoneInlineDisplay } from './inline.js';
import { _ } from '../../../i18n/index.js';

export const MicrophoneAPI : IPartAPI = {
    type: MicrophonePart.type,
    label: _('PART_MIC_LABEL', 'Microphone'),
    color: '#ef5284',
    icon: microphone,
    inlineDisplay: MicrophoneInlineDisplay,
    symbols: [{
        type: 'variable',
        name: 'volume',
        verbose: _('PART_MIC_VOLUME', 'volume'),
        returnType: Number,
        default: 0,
    }, {
        type: 'variable',
        name: 'pitch',
        verbose: _('PART_MIC_PITCH', 'pitch'),
        returnType: Number,
        default: 0,
    }, {
        type: 'function',
        name: 'onEdge',
        verbose: _('PART_MIC_ON_EDGE', 'when volume goes'),
        parameters: [{
            type: 'parameter',
            name: 'type',
            verbose: '',
            returnType: 'Enum',
            enum: [
                [_('PART_MIC_OVER', 'over'), 'rising'],
                [_('PART_MIC_UNDER', 'under'), 'falling'],
            ],
        }, {
            type: 'parameter',
            name: 'value',
            verbose: '',
            returnType: Number,
            default: 70,
        }, {
            type: 'parameter',
            name: 'callback',
            verbose: '',
            returnType: Function,
        }],
        blockly: {
            postProcess(block : any) {
                block.setInputsInline(true);
                block.setPreviousStatement(false);
                block.setNextStatement(false);
            },
        },
    }],
};
