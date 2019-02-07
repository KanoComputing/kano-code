import { ClockPart } from './clock.js';
import { IPartAPI } from '../../api.js';
import { clock } from '@kano/icons/parts.js'
import { ClockInlineDisplay } from './inline.js';

export const ClockAPI : IPartAPI = {
    type: ClockPart.type,
    color: '#00c7b6',
    label: 'Clock',
    icon: clock,
    inlineDisplay: ClockInlineDisplay,
    symbols: [{
        type: 'function',
        name: 'getCurrent',
        verbose: 'current',
        returnType: Number,
        parameters: [{
            type: 'parameter',
            name: 'key',
            verbose: '',
            returnType: 'Enum',
            enum: [
                [
                    'Year',
                    'year',
                ],
                [
                    'Month',
                    'month',
                ],
                [
                    'Day',
                    'day',
                ],
                [
                    'Hour',
                    'hour',
                ],
                [
                    'Minute',
                    'minute',
                ],
                [
                    'Seconds',
                    'seconds',
                ],
                [
                    'Milliseconds',
                    'milliseconds',
                ],
            ]
        }],
    }, {
        type: 'function',
        name: 'get',
        verbose: 'current',
        returnType: String,
        parameters: [{
            type: 'parameter',
            name: 'key',
            verbose: '',
            returnType: 'Enum',
            enum: [
                [
                    'Date',
                    'date',
                ],
                [
                    'Time',
                    'time',
                ],
            ]
        }],
    }],
};
