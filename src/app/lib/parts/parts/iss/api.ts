import { IPartAPI } from '../../api.js';
import { ISSPart } from './iss.js';
import { iss } from '@kano/icons/parts.js';
import { DataAPI, onInstall } from '../data/api.js';
import { Editor } from '../../../editor/editor.js';
import { _ } from '../../../i18n/index.js';

export const ISSAPI : IPartAPI = {
    type: ISSPart.type,
    label: _('PART_ISS_LABEL', 'ISS'),
    color: '#9b61bd',
    icon: iss,
    symbols: [...DataAPI, {
        type: 'variable',
        name: 'latitude',
        verbose: _('PART_ISS_LATITUDE', 'latitude'),
        returnType: Number,
    }, {
        type: 'variable',
        name: 'longitude',
        verbose: _('PART_ISS_LONGITUDE', 'longitude'),
        returnType: Number,
    }],
    onInstall(editor : Editor, part : ISSPart) {
        onInstall(editor, part);
    },
};
