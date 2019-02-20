import { ButtonPart } from './button.js';
import { IPartAPI } from '../../api.js';
import { TransformAPI, onTransformInstall } from '../transform/api.js';
import { button } from '@kano/icons/parts.js'
import { Editor } from '../../../editor/editor.js';
import { TransformInlineDisplay } from '../transform/inline.js';

export const ButtonAPI : IPartAPI = {
    type: ButtonPart.type,
    color: '#00c7b6',
    label: 'Button',
    icon: button,
    inlineDisplay: TransformInlineDisplay,
    symbols: [{
        type: 'variable',
        name: 'label',
        setter: true,
        returnType: String,
        default: 'Click Me!'
    }, {
        type: 'variable',
        name: 'background',
        returnType: 'Color',
        default: '#FF8F00',
        setter: true,
    }, {
        type: 'variable',
        name: 'color',
        returnType: 'Color',
        default: '#FFFFFF',
        setter: true,
    }, ...TransformAPI],
    onInstall(editor : Editor, part : ButtonPart) {
        onTransformInstall(editor, part);
    }
};
