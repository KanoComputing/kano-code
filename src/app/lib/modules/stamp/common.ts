import { IMetaDefinition } from '../../meta-api/module.js';
import { stamps } from './data.js';
import { _ } from '../../i18n/index.js';

export const random: IMetaDefinition = {
    type: 'function',
    name: 'random',
    verbose: _('PART_STICKER_RANDOM', 'random'),
    returnType: 'Sticker'
};
export const randomFrom: IMetaDefinition = {
    type: 'function',
    name: 'randomFrom',
    verbose: _('PART_STICKER_RANDOM_FROM', 'random'),
    returnType: 'Sticker',
    parameters: [{
        type: 'parameter',
        name: 'set',
        verbose: '',
        returnType: 'Enum',
        enum: stamps.map<[string, string]>(stamp => [stamp.label, stamp.id]),
    }]
};
