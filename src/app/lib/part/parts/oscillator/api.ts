import { OscillatorPart } from './oscillator.js';
import { IPartAPI } from '../../api.js';

export const OscillatorAPI : IPartAPI = {
    type: OscillatorPart.type,
    color: '#00c7b6',
    label: 'Osc',
    symbols: [{
        type: 'function',
        name: 'getValue',
        verbose: 'value',
        returnType: Number,
    }],
};
