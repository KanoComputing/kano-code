import { localize } from '../../i18n/index.js';
import { Block, Field } from '@kano/kwc-blockly/blockly.js';

const COLOR = '#88c440';

const ID = 'color';

const colorFormats = [
    ['RGB', 'rgb'],
    ['HSV', 'hsv'],
];

export const ColorAPI = {
    type: 'blockly',
    id: ID,
    name: ID,
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
    register(Blockly : Blockly) {
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
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
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
                const dropdown = new Blockly.FieldDropdown(colorFormats, function (this : Field, option : any) {
                    (this.sourceBlock_ as any).updateShape_(option);
                });

                this.setColour(COLOR);

                this.appendDummyInput()
                    .appendField('new colour with')
                    .appendField(dropdown, 'TYPE');

                this.setOutput('Colour');

                this.createInputs_('rgb');
            },
            updateShape_(option : string) {
                this.removeInput('1');
                this.removeInput('2');
                this.removeInput('3');

                this.createInputs_(option);
            },
            createInputs_(option : string) {
                Object.keys(this.inputs[option]).forEach((key) => {
                    this.appendValueInput(key)
                        .setCheck('Number')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(this.inputs[option][key]);
                });
            },
            domToMutation(xmlElement : HTMLElement) {
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

        Blockly.JavaScript.create_color = (block : Block) => {
            const type = block.getFieldValue<'rgb'|'hsv'>('TYPE');
            const one = Blockly.JavaScript.valueToCode(block, '1', Blockly.JavaScript.ORDER_COMMA) || 0;
            let two = Blockly.JavaScript.valueToCode(block, '2', Blockly.JavaScript.ORDER_COMMA);
            let three = Blockly.JavaScript.valueToCode(block, '3', Blockly.JavaScript.ORDER_COMMA);
            const defaults = type === 'hsv' ? 100 : 0;
            two = two || defaults;
            three = three || defaults;
            const code = `colour.create('${type}', ${one}, ${two}, ${three})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
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

        Blockly.JavaScript.color_lerp = (block : Block) => {
            const from = Blockly.JavaScript.valueToCode(block, 'FROM', Blockly.JavaScript.ORDER_COMMA) || '"#000000"';
            const to = Blockly.JavaScript.valueToCode(block, 'TO', Blockly.JavaScript.ORDER_COMMA) || '"#ffffff"';
            const percent = Blockly.JavaScript.valueToCode(block, 'PERCENT', Blockly.JavaScript.ORDER_COMMA) || 50;
            const code = `colour.lerp(${from}, ${to}, ${percent})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        };

        Blockly.Blocks.colour_picker.customColor = COLOR;
    },
    category: {
        get name() {
            return localize('CATEGORY_COLOR', 'Color');
        },
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
    labels: {
        create_color: {
            TYPE: colorFormats,
        },
    },
};

export default ColorAPI;
