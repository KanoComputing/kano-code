import { SynthPart } from './synth.js';
import { IPartAPI } from '../../api.js';
import { synth } from '@kano/icons/parts.js';

export const SynthAPI : IPartAPI = {
    type: SynthPart.type,
    color: '#00c7b6',
    label: 'Synth',
    icon: synth,
    symbols: [{
        type: 'function',
        name: 'setVolume',
        verbose: 'set',
        parameters: [{
            type: 'parameter',
            name: 'volume',
            returnType: Number,
            default: 100,
        }],
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
        type: 'function',
        name: 'setPitch',
        verbose: 'set pitch',
        parameters: [{
            type: 'parameter',
            name: 'pitch',
            verbose: '',
            returnType: Number,
            default: 25,
        }],
    }, {
        type: 'function',
        name: 'setWave',
        verbose: 'set wave',
        parameters: [{
            type: 'parameter',
            name: 'wave',
            verbose: '',
            returnType: 'Enum',
            enum: [
                ['sine', 'sine'],
                ['square', 'square'],
                ['triangle', 'triangle'],
                ['sawtooth', 'sawtooth'],
            ],
        }],
    }],
};
