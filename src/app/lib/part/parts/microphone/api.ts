import { IPartAPI } from '../../api.js';
import { MicrophonePart } from './microphone.js';
import { microphone } from '@kano/icons/parts.js';
import { MicrophoneInlineDisplay } from './inline.js';

export const MicrophoneAPI : IPartAPI = {
    type: MicrophonePart.type,
    label: 'Microphone',
    color: '#ef5284',
    icon: microphone,
    inlineDisplay: MicrophoneInlineDisplay,
    symbols: [{
        type: 'variable',
        name: 'volume',
        returnType: Number,
        default: 0,
    }, {
        type: 'variable',
        name: 'pitch',
        returnType: Number,
        default: 0,
    }, {
        type: 'function',
        name: 'onEdge',
        verbose: 'when volume goes',
        parameters: [{
            type: 'parameter',
            name: 'type',
            verbose: '',
            returnType: 'Enum',
            enum: [
                ['over', 'rising'],
                ['under', 'falling'],
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
