import { SynthPart } from './synth.js';
import { IPartAPI } from '../../api.js';
import { synth } from '@kano/icons/parts.js';
import { _ } from '../../../i18n/index.js';

export const SynthAPI : IPartAPI = {
    type: SynthPart.type,
    color: '#ef5284',
    label: _('PART_SYNTH_LABEL', 'Synth'),
    icon: synth,
    symbols: [{
        type: 'variable',
        name: 'volume',
        verbose: _('PART_SYNTH_VOLUME', 'volume'),
        setter: true,
        returnType: Number,
        default: 100,
    }, {
        type: 'function',
        name: 'playFrequency',
        verbose: _('PART_SYNTH_PLAY', 'play'),
        parameters: [{
            type: 'parameter',
            name: 'pitch',
            verbose: _('PART_SYNTH_PITCH', 'pitch'),
            returnType: Number,
            default: 25,
        }, {
            type: 'parameter',
            name: 'for',
            verbose: _('PART_SYNTH_FOR', 'for'),
            returnType: Number,
            default: 200,
        }],
    }, {
        type: 'function',
        name: 'start',
        verbose: _('PART_SYNTH_START', 'start'),
    }, {
        type: 'function',
        name: 'stop',
        verbose: _('PART_SYNTH_STOP', 'stop'),
    }, {
        type: 'variable',
        name: 'pitch',
        verbose: _('PART_SYNTH_PITCH', 'pitch'),
        setter: true,
        returnType: Number,
        default: 25,
    }, {
        type: 'variable',
        name: 'wave',
        verbose: _('PART_SYNTH_WAVE', 'wave'),
        setter: true,
        getter: false,
        returnType: 'Enum',
        enum: [
            [_('PART_SYNTH_SINE', 'sine'), 'sine'],
            [_('PART_SYNTH_SQUARE', 'square'), 'square'],
            [_('PART_SYNTH_SAWTOOTH', 'sawtooth'), 'sawtooth'],
            [_('PART_SYNTH_TRIANGLE', 'triangle'), 'triangle'],
        ],
    }],
};
