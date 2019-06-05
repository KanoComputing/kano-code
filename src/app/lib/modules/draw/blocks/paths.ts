import { Blockly, Block } from '@kano/kwc-blockly/blockly.js';
import { _ } from '../../../i18n/index.js';

export const paths : any[] = [{
    block: (part : any) => {
        return {
            id: 'line_to',
            lookup: 'lineTo(x, y)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_LINE_TO}`,
            args0: [{
                type: "input_value",
                name: "X",
                check: 'Number'
            },{
                type: "input_value",
                name: "Y",
                check: 'Number',
                align: 'RIGHT'
            }],
            inlineInputs: true,
            previousStatement: null,
            nextStatement: null,
        };
    },
    javascript: () => {
        return function (block : Block) {
            let x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_COMMA) || 'null',
                y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_COMMA) || 'null';
            return `ctx.lineTo(${x}, ${y});\n`;
        };
    }
},{
    block: (part : any) => {
        return {
            id: 'line',
            lookup: 'line(x, y)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_LINE_ALONG}`,
            args0: [{
                type: "input_value",
                name: "X",
                check: 'Number'
            },{
                type: "input_value",
                name: "Y",
                check: 'Number',
                align: 'RIGHT'
            }],
            inlineInputs: true,
            previousStatement: null,
            nextStatement: null,
        };
    },
    javascript: () => {
        return function (block : Block) {
            let x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_COMMA) || 'null',
                y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_COMMA) || 'null';
            return `ctx.line(${x}, ${y});\n`;
        };
    },
}];

export default paths;
