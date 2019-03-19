import { TouchPart } from './touch.js';
import { IPartAPI } from '../../api.js';
import { svg } from '@kano/icons-rendering/index.js';

const touch = svg`<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>Kano-Iconset</title><path d="M32,56A24,24,0,1,1,56,32,24,24,0,0,1,32,56Zm0-44.72A20.75,20.75,0,1,0,52.75,32,20.77,20.77,0,0,0,32,11.25Z"/><path d="M32,48.84A16.84,16.84,0,1,1,48.85,32,16.86,16.86,0,0,1,32,48.84Zm0-30.46A13.62,13.62,0,1,0,45.62,32,13.64,13.64,0,0,0,32,18.38Z"/><path d="M32,41.06A9.06,9.06,0,1,1,41.07,32,9.07,9.07,0,0,1,32,41.06Z"/></svg>`;

export const TouchAPI : IPartAPI = {
    type: TouchPart.type,
    label: 'Touch',
    icon: touch,
    color: '#ef5284',
    symbols: [{
        type: 'variable',
        name: 'x',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'y',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'dx',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'dy',
        returnType: Number,
    }],
};