import { SynthPart } from './synth.js';
import { IPartAPI } from '../../api.js';
import { _ } from '../../../i18n/index.js';
import { svg } from '@kano/icons-rendering/index.js';

const icon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.76 47.76"><title>Asset 5</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M41.86,7.75a1.21,1.21,0,1,0-1.21-1.21A1.21,1.21,0,0,0,41.86,7.75Z"/><path d="M10.83,14.11A2.85,2.85,0,1,0,8,11.26,2.86,2.86,0,0,0,10.83,14.11Z"/><path d="M43.54,0H4.21A4.22,4.22,0,0,0,0,4.21V43.54a4.23,4.23,0,0,0,4.21,4.22H43.54a4.23,4.23,0,0,0,4.22-4.22V4.21A4.23,4.23,0,0,0,43.54,0ZM36,45H29.73V23h4.84v9.45H36ZM18,45H11.75V32.46h1.43V23h3.41v9.45H18ZM9,45H4.21a1.44,1.44,0,0,1-1.45-1.45V23H7.6v9.45H9Zm11.7-12.53h1.43V23H27V45H20.74Zm18,0h1.43V23H45V43.55A1.43,1.43,0,0,1,43.55,45H38.72Zm6.11-20v4.74a.63.63,0,0,1-.62.63H41.64a.64.64,0,0,1-.63-.63V12.41a.64.64,0,0,1,.63-.64h2.57A.63.63,0,0,1,44.83,12.41Zm-3-8a2.12,2.12,0,1,1-2.13,2.12A2.12,2.12,0,0,1,41.86,4.42Zm-9.34,8a.63.63,0,0,1,.64-.64h2.55a.63.63,0,0,1,.63.64v4.74a.63.63,0,0,1-.63.63H33.16a.64.64,0,0,1-.64-.63Zm-8.49,0a.63.63,0,0,1,.63-.64h2.56a.63.63,0,0,1,.63.64v4.74a.63.63,0,0,1-.63.63H24.66a.63.63,0,0,1-.63-.63ZM10.83,4a7.27,7.27,0,1,1-7.26,7.27A7.28,7.28,0,0,1,10.83,4Z"/></g></g></svg>`;

export const SynthAPI : IPartAPI = {
    type: SynthPart.type,
    color: '#ef5284',
    label: _('PART_SYNTH_LABEL', 'Synth'),
    icon,
    symbols: [{
        type: 'variable',
        name: 'volume',
        verbose: _('PART_SYNTH_VOLUME', 'volume'),
        setter: true,
        getter: false,
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
        getter: false,
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
