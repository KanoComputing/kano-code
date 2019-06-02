import { ButtonPart } from './button.js';
import { IPartAPI } from '../../api.js';
import { TransformAPI, onTransformInstall } from '../transform/api.js';
import { button } from '@kano/icons/parts.js'
import { Editor } from '../../../editor/editor.js';
import { TransformInlineDisplay } from '../transform/inline.js';
import { _ } from '../../../i18n/index.js';

export const ButtonAPI : IPartAPI = {
    type: ButtonPart.type,
    color: '#00c7b6',
    label: _('PART_BUTTON_LABEL', 'Button'),
    icon: button,
    inlineDisplay: TransformInlineDisplay,
    symbols: [{
        type: 'variable',
        name: 'label',
        verbose: _('BUTTON_LABEL', 'label'),
        setter: true,
        returnType: String,
        default: _('BUTTON_LABEL_DEFAULT_VALUE', 'Click Me!'),
    }, {
        type: 'variable',
        name: 'background',
        verbose: _('PART_BUTTON_BACKGROUND', 'background'),
        returnType: 'Color',
        default: '#FF8F00',
        setter: true,
    }, {
        type: 'variable',
        name: 'color',
        verbose: _('PART_BUTTON_COLOR', 'color'),
        returnType: 'Color',
        default: '#FFFFFF',
        setter: true,
    }, ...TransformAPI],
    onInstall(editor : Editor, part : ButtonPart) {
        onTransformInstall(editor, part);
    }
};
