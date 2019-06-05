import { IPartAPI } from '../../api.js';
import { WeatherPart } from './weather.js';
import { weather } from '@kano/icons/parts.js';
import { DataAPI, onInstall } from '../data/api.js';
import { Editor } from '../../../editor/editor.js';
import { WeatherInlineDisplay } from './inline.js';
import { _ } from '../../../i18n/index.js';

export const WeatherAPI : IPartAPI = {
    type: WeatherPart.type,
    label: _('PART_WEATHER_LABEL', 'Weather'),
    color: '#9b61bd',
    icon: weather,
    inlineDisplay: WeatherInlineDisplay,
    symbols: [{
        type: 'function',
        name: 'is',
        verbose: _('PART_WEATHER_IS', 'is'),
        returnType: Boolean,
        parameters: [{
            type: 'parameter',
            name: 'type',
            returnType: 'Enum',
            enum: [
                [_('PART_WEATER_CLOUDY', 'cloudy'), 'cloudy'],
                [_('PART_WEATER_RAINY', 'rainy'), 'rainy'],
                [_('PART_WEATER_SNOWY', 'snowy'), 'snowy'],
                [_('PART_WEATER_SUNNY', 'sunny'), 'sunny'],
            ],
        }],
    }, {
        type: 'variable',
        name: 'temperature',
        verbose: _('PART_WEATHER_TEMPERATURE', 'temperature'),
        returnType: Number,
    }, {
        type: 'variable',
        name: 'windSpeed',
        verbose: _('PART_WEATHER_WIND_SPEED', 'wind speed'),
        returnType: Number,
    }, {
        type: 'variable',
        name: 'windDirection',
        verbose: _('PART_WEATHER_WIND_DIRECTION', 'wind direction'),
        returnType: Number,
    }, {
        type: 'variable',
        name: 'clouds',
        verbose: _('PART_WEATHER_CLOUDS', 'clouds'),
        returnType: Number,
    }, {
        type: 'variable',
        name: 'emoji',
        verbose: _('PART_WEATHER_EMOJI', 'emoji'),
        returnType: String,
    }, {
        type: 'variable',
        name: 'location',
        verbose: _('PART_WEATHER_LOCATION', 'location'),
        setter: true,
        returnType: String,
        default: WeatherPart.defaultLocation,
    }, ...DataAPI],
    onInstall(editor : Editor, part : WeatherPart) {
        onInstall(editor, part);
    },
};
