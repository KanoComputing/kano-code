/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Block, Blockly } from '@kano/kwc-blockly/blockly.js';

export const space = [{
    block: (part : any) => {
        return {
            id: 'move_to',
            lookup: 'moveTo(x, y)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_MOVE_TO}`,
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
    javascript: (part : any) => {
        return function (block: Block) {
            let x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_COMMA) || 'null',
                y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_COMMA) || 'null';
            return `ctx.moveTo(${x}, ${y});\n`;
        };
    }
},{
    block: (part : any) => {
        return {
            id: 'move_to_random',
            lookup: 'moveToRandom()',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_MOVE_TO_RANDOM}`,
            args0: [],
            inlineInputs: false,
            previousStatement: null,
            nextStatement: null,
            shadow: {}
        };
    },
    javascript: (part : any) => {
        return function (block: Block) {
            return `ctx.moveToRandom();\n`;
        };
    }
},{
    block: (part : any) => {
        return {
            id: 'move',
            lookup: 'move(x, y)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_MOVE_BY}`,
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
    javascript: (part : any) => {
        return function (block: Block) {
            let x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_COMMA) || 'null',
                y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_COMMA) || 'null';
            return `ctx.move(${x}, ${y});\n`;
        };
    },
}];

export default space;
