import { OscillatorPart } from './oscillator.js';
import { IPartAPI } from '../../api.js';

export const OscillatorAPI : IPartAPI = {
    type: OscillatorPart.type,
    color: '#00c7b6',
    label: 'Osc',
    symbols: [{
        type: 'variable',
        name: 'value',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'speed',
        returnType: Number,
        default: 50,
        setter: true,
    }, {
        type: 'variable',
        name: 'delay',
        returnType: Number,
        default: 50,
        setter: true,
    }, {
        type: 'variable',
        name: 'wave',
        returnType: 'Enum',
        enum: [
            ['sine', 'sine'],
            ['square', 'square'],
            ['sawtooth', 'sawtooth'],
            ['triangle', 'triangle'],
        ],
        default: 'sine',
        getter: false,
        setter: true,
    }],
};
