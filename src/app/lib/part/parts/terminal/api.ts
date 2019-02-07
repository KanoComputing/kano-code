import { TerminalPart } from './terminal.js';
import { IPartAPI } from '../../api.js';

export const TerminalAPI : IPartAPI = {
    type: TerminalPart.type,
    color: '#00c7b6',
    label: 'Terminal',
    symbols: [{
        type: 'variable',
        name: 'visible',
        returnType: 'Enum',
        enum: [
            ['show', 'true'],
            ['hide', 'false'],
        ],
        default: true,
        setter: true,
        getter: false,
    }, {
        type: 'function',
        name: 'printLine',
        verbose: 'print',
        parameters: [{
            type: 'parameter',
            name: 'line',
            returnType: String,
            default: '',
        }],
    }, {
        type: 'function',
        name: 'print',
        parameters: [{
            type: 'parameter',
            name: 'line',
            verbose: '',
            returnType: String,
            default: '',
        }],
    }, {
        type: 'function',
        name: 'clear',
    }],
};
