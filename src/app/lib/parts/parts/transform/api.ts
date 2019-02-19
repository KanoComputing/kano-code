import { IMetaDefinition, Meta } from '../../../meta-api/module.js';
import { addFlashField, setupFlash } from '../../../plugins/flash.js';
import { Block, Blockly } from '@kano/kwc-blockly/blockly.js';
import Editor from '../../../editor/editor.js';
import { DOMPart } from '../dom/dom.js';

export const TransformAPI : IMetaDefinition[] = [
    {
        type: 'function',
        name: 'moveAlong',
        verbose: 'move',
        parameters: [{
            type: 'parameter',
            name: 'distance',
            returnType: Number,
            default: 0,
        }],
    },
    {
        type: 'function',
        name: 'turn',
        verbose: 'turn',
        parameters: [{
            type: 'parameter',
            name: 'type',
            verbose: '',
            returnType: 'Enum',
            enum: [
                ['\u21BB', 'clockwise'],
                ['\u21BA', 'counterclockwise'],
                ['to', 'to'],
            ],
        }, {
            type: 'parameter',
            name: 'rotation',
            returnType: Number,
            default: 0,
        }],
        blockly: {
            javascript(Blockly : Blockly, block : Block, m : Meta) {
                const type = block.getFieldValue('TYPE');
                const value = Blockly.JavaScript.valueToCode(block, 'ROTATION') || 0;
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
        verbose: 'set size to',
        parameters: [{
            type: 'parameter',
            name: 'scale',
            returnType: Number,
            default: 100,
        }],
    },
    {
        type: 'function',
        name: 'moveTo',
        verbose: 'move to',
        parameters: [{
            type: 'parameter',
            name: 'x',
            returnType: Number,
            default: 0,
        }, {
            type: 'parameter',
            name: 'y',
            returnType: Number,
            default: 0,
        }],
    },
    {
        type: 'variable',
        name: 'opacity',
        returnType: Number,
        default: 100,
        setter: true,
    },
    {
        type: 'variable',
        name: 'x',
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'y',
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'scale',
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'rotation',
        returnType: Number,
    },
    {
        type: 'function',
        name: 'onClick',
        verbose: 'on click',
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
