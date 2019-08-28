import { VoicePart } from './voice.js';
import { IPartAPI } from '../../api.js';
import { oscillator } from '@kano/icons/parts.js';
import { _ } from '../../../i18n/index.js';

const accents : [string, string][] = [
    [_('PART_TTS_BRITISH', 'British English'), 'en-GB'],
    [_('PART_TTS_US', 'US English'), 'en-US'],
    [_('PART_TTS_FRENCH', 'French'), 'fr-FR'],
    [_('PART_TTS_GERMAN', 'German'), 'de-DE'],
    [_('PART_TTS_ITALIAN', 'Italian'), 'it-IT'],
];

export const VoiceAPI : IPartAPI = {
    type: VoicePart.type,
    color: '#00c7b6',
    label: _('PART_TTS_LABEL', 'Text-To-Speech'),
    icon: oscillator,
    symbols: [{
        type: 'function',
        name: 'say',
        verbose: _('PART_TTS_SAY', 'say'),
        parameters: [{
            type: 'parameter',
            name: 'text',
            verbose: '',
            returnType: String,
            default: 'Hello'
        }, {
            type: 'parameter',
            name: 'rate',
            verbose: _('PART_TTS_RATE', 'speed'),
            returnType: Number,
            default: 100
        }, {
            type: 'parameter',
            name: 'language',
            verbose: _('PART_TTS_LANGUAGE', 'language'),
            returnType: 'Enum',
            enum: accents,
            default: 'en-GB'
        }]
    }],
};
