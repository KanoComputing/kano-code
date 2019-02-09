import { Blockly, Block } from '@kano/kwc-blockly/blockly.js';

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
            shadow: {
                COLOR: '<shadow type="colour_picker"><field name="COLOUR">#000</field></shadow>',
            },
        };
    },
    javascript: () => {
        return function javascript(block : Block) {
            const color = Blockly.JavaScript.valueToCode(block, 'COLOR') || 'null';
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
            shadow: {
                'COLOR': `<shadow type="colour_picker"><field name="COLOUR">#000</field></shadow>`,
                'SIZE': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
            }
        };
    },
    javascript: () => {
        return function (block : Block) {
            let color = Blockly.JavaScript.valueToCode(block, 'COLOR') || 'null',
                size = Blockly.JavaScript.valueToCode(block, 'SIZE') || 'null';
            return `ctx.stroke(${color}, ${size});\n`;
        };
    },
}];

export default setters;
