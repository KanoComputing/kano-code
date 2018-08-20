/**
 * @namespace Kano.MakeApps.Parts.Common
 */
const COLOUR = '#C24242';

export const background = [{
    block: () => {
        return {
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
            };
    },
    javascript: (part) => {
        return (block) => {
            let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
            return `devices.get('${part.id}').style.backgroundColor = ${colour};\n`;
        };
    }
}];
