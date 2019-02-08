import { ButtonPart } from './button.js';
import { IPartAPI } from '../../api.js';
import { TransformAPI } from '../transform/api.js';
import { button } from '@kano/icons/parts.js'
import { ButtonInlineDisplay } from './inline.js';
import { addFlashField, setupFlash } from '../../plugins/flash.js';
import { IEditor } from '../../editor.js';
import { Block } from '@kano/kwc-blockly/blockly.js';

export const ButtonAPI : IPartAPI = {
    type: ButtonPart.type,
    color: '#00c7b6',
    label: 'Button',
    icon: button,
    inlineDisplay: ButtonInlineDisplay,
    symbols: [{
        type: 'function',
        name: 'getLabel',
        verbose: 'label',
        returnType: String,
    }, {
        type: 'function',
        name: 'setLabel',
        verbose: 'set label',
        parameters: [{
            type: 'parameter',
            name: 'label',
            verbose: '',
            returnType: String,
            default: 'Click Me!',
        }],
    }, {
        type: 'function',
        name: 'setBackgroundColor',
        verbose: 'set background color',
        parameters: [{
            type: 'parameter',
            name: 'color',
            verbose: '',
            returnType: 'Color',
            default: '#FF8F00',
        }],
    }, {
        type: 'function',
        name: 'setTextColor',
        verbose: 'set text color',
        parameters: [{
            type: 'parameter',
            name: 'color',
            verbose: '',
            returnType: 'Color',
            default: '#FFFFFF',
        }],
    }, {
        type: 'function',
        name: 'onClick',
        verbose: 'on',
        parameters: [{
            type: 'parameter',
            name: 'click',
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
    onInstall(editor : IEditor, part : ButtonPart) {
        setupFlash<ButtonPart>(editor, part, 'onClick');
    }
};
