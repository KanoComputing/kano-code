/**
 * @namespace Kano.MakeApps.Parts.Common
 */
const COLOUR = '#82C23D';

export const customDrawBlocks = [{
    block: {
        id: 'set_background_color',
        colour: COLOUR,
        message0: 'Background: set color to %1',
        args0: [{
            type: "input_value",
            name: "COLOUR",
            check: "Colour"
        }],
        previousStatement: null,
        nextStatement: null
    },
    javascript: (block) => {
        let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
        return `ctx.setBackgroundColor(${colour});\n`;
    }
},{
    block: {
        id: 'set_transparency',
        message0: `Transparency: set transparency to %1`,
        colour: COLOUR,
        args0: [{
            type: 'input_value',
            name: 'ALPHA',
            check: 'Number',
        }],
        previousStatement: null,
        nextStatement: null,
        shadow: {
            ALPHA: '<shadow type="math_number"><field name="NUM">100</field></shadow>',
        },
    },
    javascript: (block) => {
        const alpha = Blockly.JavaScript.valueToCode(block, 'ALPHA');
        return `ctx.setTransparency(${alpha});\n`;
    },
}];

export default customDrawBlocks;
