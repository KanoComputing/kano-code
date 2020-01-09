/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Blockly, Block } from '@kano/kwc-blockly/blockly.js';
import { _ } from '../../../i18n/index.js';

export const setters = [{
    block: (part : any) => {
        return {
            id: 'color',
            lookup: 'fillColor(color)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_FILL_COLOR}`,
            args0: [{
                type: 'input_value',
                name: 'COLOR',
                check: 'Colour',
            }],
            previousStatement: null,
            nextStatement: null,
        };
    },
    javascript: () => {
        return function javascript(block : Block) {
            const color = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_NONE) || 'null';
            return `ctx.color(${color});\n`;
        };
    },
}, {
    block: (part : any) => {
        return {
            id: 'no_fill',
            lookup: 'noFill',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_NO_FILL}`,
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: () => {
        return function () {
            return `ctx.color('transparent');\n`;
        };
    }
}, {
    block: (part : any) => {
        return {
            id: 'stroke',
            lookup: 'stroke(color, thickness)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_STROKE}`,
            args0: [{
                type: "input_value",
                name: "COLOR",
                check: 'Colour'
            },{
                type: "input_value",
                name: "SIZE",
                check: 'Number',
                align: 'RIGHT'
            }],
            previousStatement: null,
            nextStatement: null,
        };
    },
    javascript: () => {
        return function (block : Block) {
            let color = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_COMMA) || 'null',
                size = Blockly.JavaScript.valueToCode(block, 'SIZE', Blockly.JavaScript.ORDER_COMMA) || 'null';
            return `ctx.stroke(${color}, ${size});\n`;
        };
    },
}];

export default setters;
