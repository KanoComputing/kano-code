import { IPartAPI } from '../../api.js';
import { TextPart } from './text.js';
import { text } from '@kano/icons/parts.js';
import { TransformAPI, onTransformInstall } from '../transform/api.js';
import { Editor } from '../../../index.js';
import { _ } from '../../../i18n/index.js';

export const TexAPI : IPartAPI = {
    type: TextPart.type,
    label: _('PART_TEXT_LABEL', 'Text'),
    color: '#00c7b6',
    icon: text,
    symbols: [{
        type: 'variable',
        name: 'value',
        verbose: _('PART_TEXT_VALUE', 'value'),
        setter: true,
        returnType: String,
        default: 'Text',
    }, {
        type: 'variable',
        name: 'color',
        verbose: _('PART_TEXT_COLOR', 'color'),
        setter: true,
        getter: false,
        returnType: 'Color',
        default: '#000000',
    }, ...TransformAPI],
    onInstall(editor : Editor, part : TextPart) {
        onTransformInstall(editor, part);
    },
}