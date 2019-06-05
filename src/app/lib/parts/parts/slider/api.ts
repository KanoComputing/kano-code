import { IPartAPI } from '../../api.js';
import { SliderPart } from './slider.js';
import { TransformAPI, onTransformInstall } from '../transform/api.js';
import { slider } from '@kano/icons/parts.js';
import { SliderInlineDisplay } from './inline.js';
import { addFlashField, setupFlash } from '../../../plugins/flash/flash.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { Editor } from '../../../editor/editor.js';
import { _ } from '../../../i18n/index.js';

export const SliderAPI : IPartAPI = {
    type: SliderPart.type,
    color: '#00c7b6',
    label: _('PART_SLIDER_NAME', 'Slider'),
    icon: slider,
    inlineDisplay: SliderInlineDisplay,
    symbols: [{
        type: 'variable',
        name: 'value',
        verbose: _('PART_SLIDER_VALUE', 'value'),
        returnType: Number,
        default: 0,
        setter: true,
    }, {
        type: 'function',
        name: 'onChange',
        verbose: _('PART_SLIDER_ON_CHANGE', 'on change'),
        parameters: [{
            type: 'parameter',
            name: 'callback',
            verbose: '',
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
    onInstall(editor : Editor, part : SliderPart) {
        onTransformInstall(editor, part);
        if (!part.id) {
            return;
        }
        setupFlash(editor, part.id, part.core.changed, 'onChange');
    },
}
