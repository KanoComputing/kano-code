import { SynthPart } from './synth.js';
import { IPartAPI } from '../../api.js';
import { synth } from '@kano/icons/parts.js';

export const SynthAPI : IPartAPI = {
    type: SynthPart.type,
    color: '#ef5284',
    label: 'Synth',
    icon: synth,
    symbols: [{
        type: 'variable',
        name: 'volume',
        setter: true,
        returnType: Number,
        default: 100,
    }, {
        type: 'function',
        name: 'playFrequency',
        verbose: 'play',
        parameters: [{
            type: 'parameter',
            name: 'pitch',
            returnType: Number,
            default: 25,
        }, {
            type: 'parameter',
            name: 'for',
            returnType: Number,
            default: 200,
        }],
    }, {
        type: 'function',
        name: 'start'
    }, {
        type: 'function',
        name: 'stop'
    }, {
        type: 'variable',
        name: 'pitch',
        setter: true,
        returnType: Number,
        default: 25,
    }, {
        type: 'variable',
        name: 'wave',
        setter: true,
        getter: false,
        returnType: 'Enum',
        enum: [
            ['sine', 'sine'],
            ['square', 'square'],
            ['triangle', 'triangle'],
            ['sawtooth', 'sawtooth'],
        ],
    }],
};
