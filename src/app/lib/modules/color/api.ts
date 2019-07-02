import { localize } from '../../i18n/index.js';
import { Block, Field } from '@kano/kwc-blockly/blockly.js';
import { _ } from '../../i18n/index.js';

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
const color = {
    random() : string;
    create(type : 'rgb', r : number, g : number, b : number) : string;
    create(type : 'hsv', h : number, s : number, v : number) : string;
    lerp(from : number, to : number, percent : number) : string;
};
`,
    register(Blockly : Blockly) {
        Blockly.Blocks.random_colour = {
            init() {
                const json = {
                    id: 'random_colour',
                    colour: COLOR,
                    message0: Blockly.Msg.COLOUR_RANDOM_TITLE,
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
                    1: {
                        label: _('PERCENT_RED', '% red'),
                        defaultVal: '0',
                    },
                    2: {
                        label: _('PERCENT_GREEN', '% green'),
                        defaultVal: '0',
                    },
                    3: {
                        label: _('PERCENT_BLUE', '% blue'),
                        defaultVal: '0',
                    },
                },
                hsv: {
                    1: {
                        label: _('HUE', 'hue'),
                        defaultVal: '0',
                    },
                    2: {
                        label: _('SATURATION', 'saturation'),
                        defaultVal: '100',
                    },
                    3: {
                        label: _('VALUE', 'value'),
                        defaultVal: '100',
                    },
                },
            },
            init() {
                const dropdown = new Blockly.FieldDropdown(colorFormats, function (this : Field, option : any) {
                    (this.sourceBlock_ as any).updateShape_(option);
                });

                this.setColour(COLOR);

                this.appendDummyInput()
                    .appendField(_('BLOCK_CREATE_COLOR', 'new colour with'))
                    .appendField(dropdown, 'TYPE');

                this.setOutput('Colour');

                this.createInputs_('rgb');
            },
            updateShape_(option : string) {
                // for each input default
                Object.keys(this.inputs[option]).forEach((key) => {
                    const input = this.getInput(key);
                    const connection = input.connection;
                    const targetConnection = connection.targetConnection;

                    // Update field label to match type
                    input.appendField(this.inputs[option][key].label).removeField();
                    
                    // Update target connection to reflect default values
                    if (targetConnection) {
                        const sourceBlock = targetConnection.getSourceBlock();

                        // If block is a default field then update
                        if(sourceBlock.isShadow_) {
                            const field = sourceBlock.getField("NUM");
                            const val = field ? field.getValue() : false;
                            const defaultVal = this.inputs[option][key].defaultVal;
                            if (val && (val === defaultVal || (key === '2' || key === '3') && (val === '0' || val === '100'))) {
                                field.setValue(defaultVal);
                            }
                        }
                    }

                });
            },
            createInputs_(option : string) {
                Object.keys(this.inputs[option]).forEach((key) => {
                    const input = this.appendValueInput(key)
                        .setCheck('Number')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(this.inputs[option][key].label);
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
            return _('CATEGORY_COLOR', 'Color');
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
            '1': 0,
            '2': 0,
            '3': 0,
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
