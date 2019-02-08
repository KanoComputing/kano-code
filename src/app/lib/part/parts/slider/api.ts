import { IPartAPI } from '../../api.js';
import { SliderPart } from './slider.js';
import { TransformAPI } from '../transform/api.js';
import { slider } from '@kano/icons/parts.js';
import { SliderInlineDisplay } from './inline.js';
import { addFlashField, setupFlash } from '../../plugins/flash.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { IEditor } from '../../editor.js';

export const SliderAPI : IPartAPI = {
    type: SliderPart.type,
    color: '#00c7b6',
    label: 'Slider',
    icon: slider,
    inlineDisplay: SliderInlineDisplay,
    symbols: [{
        type: 'variable',
        name: 'value',
        returnType: Number,
        default: 0,
        setter: true,
    }, {
        type: 'function',
        name: 'onChange',
        verbose: 'on change',
        parameters: [{
            type: 'parameter',
            name: 'callback',
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
    onInstall(editor : IEditor, part : SliderPart) {
        setupFlash<SliderPart>(editor, part, part.core.changed, 'onChange');
    },
}
