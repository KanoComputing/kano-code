import { IPartAPI } from '../../api.js';
import { WeatherPart } from './weather.js';
import { weather } from '@kano/icons/parts.js';
import { DataAPI, onInstall } from '../data/api.js';
import { Editor } from '../../../editor/editor.js';
import { WeatherInlineDisplay } from './inline.js';

export const WeatherAPI : IPartAPI = {
    type: WeatherPart.type,
    label: 'Weather',
    color: '#9b61bd',
    icon: weather,
    inlineDisplay: WeatherInlineDisplay,
    symbols: [{
        type: 'function',
        name: 'is',
        returnType: Boolean,
        parameters: [{
            type: 'parameter',
            name: 'type',
            returnType: 'Enum',
            enum: [
                ['cloudy', 'cloudy'],
                ['rainy', 'rainy'],
                ['snowy', 'snowy'],
                ['sunny', 'sunny'],
            ],
        }],
    }, {
        type: 'variable',
        name: 'temperature',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'windSpeed',
        verbose: 'wind speed',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'windDirection',
        verbose: 'wind direction',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'clouds',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'emoji',
        returnType: String,
    }, {
        type: 'variable',
        name: 'location',
        setter: true,
        returnType: String,
        default: WeatherPart.defaultLocation,
    }, ...DataAPI],
    onInstall(editor : Editor, part : WeatherPart) {
        onInstall(editor, part);
    },
};
