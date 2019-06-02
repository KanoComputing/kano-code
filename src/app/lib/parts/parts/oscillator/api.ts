import { OscillatorPart } from './oscillator.js';
import { IPartAPI } from '../../api.js';
import { oscillator } from '@kano/icons/parts.js';
import { OscillatorInlineDisplay } from './inline.js';
import { _ } from '../../../i18n/index.js';

export const OscillatorAPI : IPartAPI = {
    type: OscillatorPart.type,
    color: '#00c7b6',
    label: _('PART_OSC_LABEL', 'Osc'),
    icon: oscillator,
    inlineDisplay: OscillatorInlineDisplay,
    symbols: [{
        type: 'variable',
        name: 'value',
        verbose: _('PART_OSC_VALUE', 'value'),
        returnType: Number,
    }, {
        type: 'variable',
        name: 'speed',
        verbose: _('PART_OSC_SPEED', 'speed'),
        returnType: Number,
        default: 50,
        setter: true,
    }, {
        type: 'variable',
        name: 'delay',
        verbose: _('PART_OSC_DELAY', 'delay'),
        returnType: Number,
        default: 50,
        setter: true,
    }, {
        type: 'variable',
        name: 'wave',
        verbose: _('PART_OSC_WAVE', 'wave'),
        returnType: 'Enum',
        enum: [
            [_('PART_OSC_SINE', 'sine'), 'sine'],
            [_('PART_OSC_SQUARE', 'square'), 'square'],
            [_('PART_OSC_SAWTOOTH', 'sawtooth'), 'sawtooth'],
            [_('PART_OSC_TRIANGLE', 'triangle'), 'triangle'],
        ],
        getter: false,
        setter: true,
    }],
};
