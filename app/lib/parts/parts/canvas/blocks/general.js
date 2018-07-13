
const general = [{
    block: (part) => {
        return {
            id: 'set_background_color',
            lookup: 'setBackgroundColor(color)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_SETBACKGROUND_COLOR}`,
            args0: [{
                type: 'input_value',
                name: 'COLOR',
                check: 'Colour',
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                COLOR: '<shadow type="colour_picker"><field name="COLOUR">#FFF</field></shadow>',
            },
        };
    },
    javascript: () => {
        return function javascript(block) {
            const color = Blockly.JavaScript.valueToCode(block, 'COLOR');
            return `ctx.setBackgroundColor(${color});\n`;
        };
    },
}];

export default general;
