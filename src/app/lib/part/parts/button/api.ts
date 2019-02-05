import { ButtonPart } from './button.js';
import { IPartAPI } from '../../api.js';
import { TransformAPI } from '../transform/api.js';

export const ButtonAPI : IPartAPI = {
    type: ButtonPart.type,
    color: '#00c7b6',
    label: 'Button',
    symbols: [{
        type: 'function',
        name: 'getLabel',
        verbose: 'label',
        returnType: String,
    }, {
        type: 'function',
        name: 'setLabel',
        verbose: 'set label',
        parameters: [{
            type: 'parameter',
            name: 'label',
            verbose: '',
            returnType: String,
            default: `'Click Me!'`,
        }],
    }, {
        type: 'function',
        name: 'setBackgroundColor',
        verbose: 'set background color',
        parameters: [{
            type: 'parameter',
            name: 'color',
            verbose: '',
            returnType: 'Color',
            default: '#FF8F00',
        }],
    }, {
        type: 'function',
        name: 'setTextColor',
        verbose: 'set text color',
        parameters: [{
            type: 'parameter',
            name: 'color',
            verbose: '',
            returnType: 'Color',
            default: '#FFFFFF',
        }],
    }, ...TransformAPI],
};
