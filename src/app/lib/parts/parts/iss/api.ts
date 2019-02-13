import { IPartAPI } from '../../api.js';
import { ISSPart } from './iss.js';
import { iss } from '@kano/icons/parts.js';
import { DataAPI, onInstall } from '../data/api.js';
import Editor from '../../../editor/editor.js';

export const ISSAPI : IPartAPI = {
    type: ISSPart.type,
    label: 'ISS',
    color: '#9b61bd',
    icon: iss,
    symbols: [...DataAPI, {
        type: 'variable',
        name: 'latitude',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'longitude',
        returnType: Number,
    }],
    onInstall(editor : Editor, part : ISSPart) {
        onInstall(editor, part);
    },
};
