const paths = [{
    block: (part) => {
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
            return `ctx.lineTo(${x}, ${y});\n`;
        };
    }
},{
    block: (part) => {
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
            return `ctx.line(${x}, ${y});\n`;
        };
    },
}];

export default paths;
