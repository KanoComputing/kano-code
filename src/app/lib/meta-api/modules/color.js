import { localize } from '../../i18n/index.js';

const COLOR = '#88c440';

const ID = 'color';

export const ColorAPI = {
    type: 'blockly',
    id: ID,
    typeScriptDefinition: `
        declare namespace colour {
            declare enum type {
                RGB: 'rgb',
                HSV: 'hsv'
            }
            declare function random(): string;
            declare function create(type: color.type, a: number, b: number, c: number): string;
            declare function lerp(from: number, to: number, percent: number): string;
        }
    `,
    register(Blockly) {
        Blockly.Blocks.random_colour = {
            init() {
                const json = {
                    id: 'random_colour',
                    colour: COLOR,
                    message0: Blockly.Msg.COLOR_RANDOM,
                    output: 'Colour',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.random_colour = () => {
            const code = 'colour.random()';
            return [code];
        };

        Blockly.Blocks.create_color = {
            inputs: {
                rgb: {
                    1: '% red',
                    2: '% green',
                    3: '% blue',
                },
                hsv: {
                    1: 'hue',
                    2: 'saturation',
                    3: 'value',
                },
            },
            init() {
                const PROPERTIES = [
                    ['RGB', 'rgb'],
                    ['HSV', 'hsv'],
                ];

                const dropdown = new Blockly.FieldDropdown(PROPERTIES, function (option) {
                    this.sourceBlock_.updateShape_(option);
                });

                this.setColour(COLOR);

                this.appendDummyInput()
                    .appendField('new colour with')
                    .appendField(dropdown, 'TYPE');

                this.setOutput('Colour');

                this.createInputs_('rgb');
            },
            updateShape_(option) {
                this.removeInput('1');
                this.removeInput('2');
                this.removeInput('3');

                this.createInputs_(option);
            },
            createInputs_(option) {
                Object.keys(this.inputs[option]).forEach((key) => {
                    this.appendValueInput(key)
                        .setCheck('Number')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(this.inputs[option][key]);
                });
            },
            domToMutation(xmlElement) {
                const type = xmlElement.getAttribute('color_type');
                this.updateShape_(type);
            },
            mutationToDom() {
                const container = document.createElement('mutation');
                const type = this.getFieldValue('TYPE');
                container.setAttribute('color_type', type);
                return container;
            },
        };

        Blockly.JavaScript.create_color = (block) => {
            const type = block.getFieldValue('TYPE');
            const one = Blockly.JavaScript.valueToCode(block, '1') || 0;
            let two = Blockly.JavaScript.valueToCode(block, '2');
            let three = Blockly.JavaScript.valueToCode(block, '3');
            const defaults = type === 'hsv' ? 100 : 0;
            two = two || defaults;
            three = three || defaults;
            const code = `colour.create('${type}', ${one}, ${two}, ${three})`;
            return [code];
        };

        Blockly.Blocks.color_lerp = {
            init() {
                const json = {
                    id: 'color_lerp',
                    colour: COLOR,
                    message0: Blockly.Msg.COLOR_LERP,
                    args0: [{
                        type: 'input_value',
                        name: 'FROM',
                        check: 'Colour',
                    }, {
                        type: 'input_value',
                        name: 'TO',
                        check: 'Colour',
                    }, {
                        type: 'input_value',
                        name: 'PERCENT',
                        check: 'Number',
                    }],
                    inputsInline: true,
                    output: 'Colour',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.color_lerp = (block) => {
            const from = Blockly.JavaScript.valueToCode(block, 'FROM') || '"#000000"';
            const to = Blockly.JavaScript.valueToCode(block, 'TO') || '"#ffffff"';
            const percent = Blockly.JavaScript.valueToCode(block, 'PERCENT') || 50;
            const code = `colour.lerp(${from}, ${to}, ${percent})`;
            return [code];
        };

        Blockly.Blocks.colour_picker.customColor = COLOR;
    },
    category: {
        name: localize('CATEGORY_COLOR', 'Color'),
        id: ID,
        colour: COLOR,
        blocks: [
            'colour_picker',
            'create_color',
            'random_colour',
            {
                id: 'color_lerp',
                defaults: ['FROM', 'TO', 'PERCENT'],
            },
        ],
    },
    defaults: {
        colour_picker: {
            COLOUR: '#ff0000',
        },
        create_color: {
            TYPE: 'rgb',
        },
        color_lerp: {
            FROM: '#000000',
            TO: '#ffffff',
            PERCENT: 50,
        },
    },
};

export default ColorAPI;
