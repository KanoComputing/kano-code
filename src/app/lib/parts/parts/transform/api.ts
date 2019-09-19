import { IMetaDefinition, Meta } from '../../../meta-api/module.js';
import { addFlashField, setupFlash } from '../../../plugins/flash/flash.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import Editor from '../../../editor/editor.js';
import { DOMPart } from '../dom/dom.js';
import { _ } from '../../../i18n/index.js';

export const TransformAPI : IMetaDefinition[] = [
    {
        type: 'function',
        name: 'moveAlong',
        verbose: _('PART_TRANSFORM_MOVE', 'move'),
        parameters: [{
            type: 'parameter',
            name: 'distance',
            verbose: _('PART_TRANSFORM_DISTANCE', 'distance'),
            returnType: Number,
            default: 0,
        }],
    },
    {
        type: 'function',
        name: 'turn',
        verbose: _('PART_TRANSFORM_TURN', 'turn'),
        parameters: [{
            type: 'parameter',
            name: 'type',
            verbose: '',
            returnType: 'Enum',
            enum: [
                ['\u21BB', 'clockwise'],
                ['\u21BA', 'counterclockwise'],
                [_('PART_TRANSFORM_TURN_TO', 'to'), 'to'],
            ],
            default: 'clockwise',
        }, {
            type: 'parameter',
            name: 'rotation',
            verbose: _('PART_TRANSFORM_ROTATION', 'rotation'),
            returnType: Number,
            default: 0,
            blockly: {
                shadow(defaultValue: number) {
                    return `<shadow type="angle"><field name="VALUE">${defaultValue}</field></shadow>`
                }
            }
        }],
        blockly: {
            javascript(Blockly : Blockly, block : Block, m : Meta) {
                const type = block.getFieldValue('TYPE');
                const value = Blockly.JavaScript.valueToCode(block, 'ROTATION', Blockly.JavaScript.ORDER_ASSIGNMENT) || 0;
                const prefix = m.getNameChain('.').replace(/\.turn$/, '');
                if (type === 'to') {
                    return `${prefix}.rotation = ${value};\n`;
                } else if (type === 'clockwise') {
                    return `${prefix}.turnCW(${value});\n`;
                } else {
                    return `${prefix}.turnCCW(${value});\n`;
                }
            },
        },
    },
    {
        type: 'function',
        name: 'setScale',
        verbose: _('PART_TRANSFORM_SET_SCALE', 'set size to'),
        parameters: [{
            type: 'parameter',
            name: 'scale',
            verbose: _('PART_TRANSFORM_SCALE', 'scale'),
            returnType: Number,
            default: 100,
        }],
    },
    {
        type: 'function',
        name: 'moveTo',
        verbose: _('PART_TRANSFORM_MOVE_TO', 'move to'),
        parameters: [{
            type: 'parameter',
            name: 'x',
            verbose: _('PART_TRANSFORM_X', 'x'),
            returnType: Number,
            default: 0,
        }, {
            type: 'parameter',
            name: 'y',
            verbose: _('PART_TRANSFORM_Y', 'y'),
            returnType: Number,
            default: 0,
        }],
    },
    {
        type: 'variable',
        name: 'opacity',
        verbose: _('PART_TRANSFORM_OPACITY', 'opacity'),
        returnType: Number,
        default: 100,
        setter: true,
    },
    {
        type: 'variable',
        name: 'x',
        verbose: _('PART_TRANSFORM_X', 'x'),
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'y',
        verbose: _('PART_TRANSFORM_Y', 'y'),
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'scale',
        verbose: _('PART_TRANSFORM_SCALE', 'scale'),
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'rotation',
        verbose: _('PART_TRANSFORM_ROTATION', 'rotation'),
        returnType: Number,
    },
    {
        type: 'function',
        name: 'onClick',
        verbose: _('PART_TRANSFORM_ON_CLICK', 'on click'),
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
    },
];


export function onTransformInstall(editor : Editor, part : DOMPart) {
    if (!part.id) {
        return;
    }
    setupFlash(editor, part.id, part.transform.click, 'onClick');
}
