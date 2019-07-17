import { Block, Blockly } from '@kano/kwc-blockly/blockly.js';
import { _ } from '../../../i18n/index.js';

export const stamp = [{
    block: (part : any) => {
        return {
            id: 'stamp',
            lookup: 'stamp(sticker, size, rotation)',
            message0: `Draw: ${Blockly.Msg.BLOCK_CANVAS_STAMP}`,
            args0: [{
                type: "input_value",
                name: "STICKER",
                check: 'Sticker',
            },{
                type: "input_value",
                name: "SIZE",
                check: 'Number',
                align: 'RIGHT'
            },{
                type: "input_value",
                name: "ROTATION",
                check: 'Number',
                align: 'RIGHT'
            }],
            previousStatement: null,
            nextStatement: null,
        }
    },
    javascript: (part : any) => {
        return function (block: Block) {
            const image = Blockly.JavaScript.valueToCode(block, 'STICKER', Blockly.JavaScript.ORDER_NONE) || 'null';
            const size = Blockly.JavaScript.valueToCode(block, 'SIZE', Blockly.JavaScript.ORDER_NONE) || 'null';
            const rotation = Blockly.JavaScript.valueToCode(block, 'ROTATION', Blockly.JavaScript.ORDER_NONE) || 'null';
    
            return `ctx.stamp(${image}, ${size}, ${rotation});`;
        }
    }
}]


export default stamp;