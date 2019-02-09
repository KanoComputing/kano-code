import { IPartAPI } from '../../api.js';
import { TextInputPart } from './text-input.js';
import { textInput } from '@kano/icons/parts.js';
import { TransformAPI } from '../transform/api.js';
import { TextInputInlineDisplay } from './inline.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { addFlashField, setupFlash } from '../../../plugins/flash.js';
import { IEditor } from '../../editor.js';

export const TextInputAPI : IPartAPI = {
    type: TextInputPart.type,
    label: 'Text Input',
    color: '#00c7b6',
    icon: textInput,
    inlineDisplay: TextInputInlineDisplay,
    symbols: [{
        type: 'variable',
        name: 'value',
        setter: true,
        returnType: String,
        default: '',
    }, {
        type: 'variable',
        name: 'placeholder',
        setter: true,
        returnType: String,
        default: '',
    }, {
        type: 'function',
        name: 'onChange',
        verbose: 'on',
        parameters: [{
            type: 'parameter',
            name: 'change',
            returnType: Function,
        }],
        blockly: {
            postProcess(block : Block) {
                addFlashField(block);
                block.setPreviousStatement(false);
                block.setNextStatement(false);
            },
        },
    }, ...TransformAPI],
    onInstall(editor : IEditor, part : TextInputPart) {
        if (!part.id) {
            return;
        }
        setupFlash(editor, part.id, part.core.change, 'onChange');
    }
};
