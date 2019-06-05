import { Block } from '@kano/kwc-blockly/blockly.js';

export const registerRepeatDrawing = (Blockly : Blockly, defaultColor: string) => {
    Blockly.Blocks.draw_repeat_drawing = {
        init() {
            const json = {
                id: 'draw_repeat_drawing',
                lookup: 'repeat_drawing(repeats, rotation, movementX, movementY)',
                message0: `Draw: ${Blockly.Msg.BLOCK_CANVAS_REPEAT_DRAWING}`,
                args0: [{
                    type: "input_value",
                    name: "REPEATS",
                    check: 'Number'
                },{
                    type: "input_value",
                    name: "ROTATION",
                    check: 'Number',
                    align: 'RIGHT'
                },{
                    type: "input_value",
                    name: "MOVEMENTX",
                    check: 'Number',
                    align: 'RIGHT'
                },{
                    type: "input_value",
                    name: "MOVEMENTY",
                    check: 'Number',
                    align: 'RIGHT'
                }],
                message1: `%1`,
                args1: [{
                    type: 'input_statement',
                    name: 'STATEMENT',
                }],
                previousStatement: null,
                nextStatement: null,
            };
            this.jsonInit(json);
        }
    };
    Blockly.Blocks.draw_repeat_drawing.customColor = defaultColor;

    Blockly.JavaScript.draw_repeat_drawing = (block : Block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'STATEMENT'),
        repeats = Blockly.JavaScript.valueToCode(block, 'REPEATS', Blockly.JavaScript.ORDER_COMMA) || 'null',
        rotation = Blockly.JavaScript.valueToCode(block, 'ROTATION', Blockly.JavaScript.ORDER_COMMA) || 'null',
        movementX = Blockly.JavaScript.valueToCode(block, 'MOVEMENTX', Blockly.JavaScript.ORDER_COMMA) || 'null',
        movementY = Blockly.JavaScript.valueToCode(block, 'MOVEMENTY', Blockly.JavaScript.ORDER_COMMA) || 'null';

        return `ctx.repeatDrawing(${repeats}, ${rotation}, ${movementX}, ${movementY}, function(){\n${statement}});`;
    };
}

export default registerRepeatDrawing