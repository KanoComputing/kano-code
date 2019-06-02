import { Blockly, Block } from '@kano/kwc-blockly/blockly.js';
import { _ } from '../../../i18n/index.js';

export const general : any[] = [{
    block: (part : any) => {
        return {
            id: 'set_background_color',
            message0: `${part.name}: ${_('DRAW_SET_BACKGROUND_COLOR', 'Set background color')} %1`,
            args0: [{
                type: "input_value",
                name: "COLOR",
                check: 'Colour'
            }],
            inlineInputs: true,
            previousStatement: null,
            nextStatement: null,
        };
    },
    javascript: () => {
        return function (block : Block) {
            let c = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_ASSIGNMENT) || '#ffffff';
            return `ctx.background = ${c};\n`;
        };
    }
}, {
    block: (part : any) => {
        return {
            id: 'set_transparency',
            message0: `${part.name}: ${_('DRAW_SET_TRANSPARENCY', 'Set transparentcy to')} %1`,
            args0: [{
                type: "input_value",
                name: "ALPHA",
                check: 'Number'
            }],
            inlineInputs: true,
            previousStatement: null,
            nextStatement: null,
        };
    },
    javascript: () => {
        return function (block : Block) {
            let a = Blockly.JavaScript.valueToCode(block, 'ALPHA', Blockly.JavaScript.ORDER_ASSIGNMENT) || '100';
            return `ctx.opacity = ${a};\n`;
        };
    }
}];

export default general;
