import { ClockPart } from './clock.js';
import { IPartAPI } from '../../api.js';
import { clock } from '@kano/icons/parts.js'
import { ClockInlineDisplay } from './inline.js';
import { _ } from '../../../i18n/index.js';

export const ClockAPI : IPartAPI = {
    type: ClockPart.type,
    color: '#9b61bd',
    label: _('PART_CLOCK_LABEL', 'Clock'),
    icon: clock,
    inlineDisplay: ClockInlineDisplay,
    symbols: [{
        type: 'function',
        name: 'getCurrent',
        verbose: _('PART_CLOCK_CURRENT', 'current'),
        returnType: Number,
        parameters: [{
            type: 'parameter',
            name: 'key',
            verbose: '',
            returnType: 'Enum',
            enum: [
                [
                    _('PART_CLOCK_YEAR', 'Year'),
                    'year',
                ],
                [
                    _('PART_CLOCK_MONTH', 'Month'),
                    'month',
                ],
                [
                    _('PART_CLOCK_DAY', 'Day'),
                    'day',
                ],
                [
                    _('PART_CLOCK_HOUR', 'Hour'),
                    'hour',
                ],
                [
                    _('PART_CLOCK_MINUTE', 'Minute'),
                    'minute',
                ],
                [
                    _('PART_CLOCK_SECONDS', 'Seconds'),
                    'seconds',
                ],
                [
                    _('PART_CLOCK_MILLISECONDS', 'Milliseconds'),
                    'milliseconds',
                ],
            ]
        }],
    }, {
        type: 'function',
        name: 'get',
        verbose: _('PART_CLOCK_CURRENT', 'current'),
        returnType: String,
        parameters: [{
            type: 'parameter',
            name: 'key',
            verbose: '',
            returnType: 'Enum',
            enum: [
                [
                    _('PART_CLOCK_DATE', 'Date'),
                    'date',
                ],
                [
                    _('PART_CLOCK_TIME', 'Time'),
                    'time',
                ],
            ]
        }],
    }],
};
