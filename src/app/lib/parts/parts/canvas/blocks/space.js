const space = [{
    block: (part) => {
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
            shadow: {
                'X': `<shadow type="math_number"><field name="NUM">5</field></shadow>`,
                'Y': `<shadow type="math_number"><field name="NUM">5</field></shadow>`
            }
        };
    },
    javascript: (part) => {
        return function (block) {
            let x = Blockly.JavaScript.valueToCode(block, 'X') || 'null',
                y = Blockly.JavaScript.valueToCode(block, 'Y') || 'null';
            return `ctx.moveTo(${x}, ${y});\n`;
        };
    }
},{
    block: (part) => {
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
    javascript: (part) => {
        return function (block) {
            return `ctx.moveToRandom();\n`;
        };
    }
},{
    block: (part) => {
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
            shadow: {
                'X': `<shadow type="math_number"><field name="NUM">5</field></shadow>`,
                'Y': `<shadow type="math_number"><field name="NUM">5</field></shadow>`
            }
        };
    },
    javascript: (part) => {
        return function (block) {
            let x = Blockly.JavaScript.valueToCode(block, 'X') || 'null',
                y = Blockly.JavaScript.valueToCode(block, 'Y') || 'null';
            return `ctx.move(${x}, ${y});\n`;
        };
    },
}];

export default space;
