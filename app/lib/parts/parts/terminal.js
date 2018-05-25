import { localize } from '../../i18n/index.js';

const terminal = {
    partType: 'ui',
    type: 'terminal',
    label: localize('PART_TERMINAL_NAME'),
    component: 'kano-part-terminal',
    image: '/assets/part/terminal.svg',
    colour: '#607d8b',
    excludeDefaultBlocks: true,
    visible: false,
    singleton: true,
    customizable: {
        properties: [],
        style: [],
    },
    blocks: [{
        block: (part) => {
            return {
                id: 'toggle_on_off',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_TERMINAL_TOGGLE}`,
                args0: [{
                    type: "field_dropdown",
                    options: [
                        [Blockly.Msg.BLOCK_TERMINAL_ON, 'on'],
                        [Blockly.Msg.BLOCK_TERMINAL_OFF, 'off']
                    ],
                    name: "TOGGLE"
                }],
                nextStatement: null,
                previousStatement: null,
            }
        },
        javascript: (part) => {
            return function (block) {
                let toggle = block.getFieldValue('TOGGLE') || 'on',
                    value = toggle === 'on' ? true : false;
                return `devices.get('${part.id}').toggle(${value});`;
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'print_line',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_TERMINAL_PRINT_LINE}`,
                args0: [{
                    type: "input_value",
                    name: "MESSAGE"
                }],
                nextStatement: null,
                previousStatement: null,
                shadow: {
                    'MESSAGE': `<shadow type="text"></shadow>`
                }
            }
        },
        javascript: (part) => {
            return function (block) {
                let value = Blockly.JavaScript.valueToCode(block, 'MESSAGE');
                return `devices.get('${part.id}').printLine(${value});`;
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'print',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_TERMINAL_PRINT}`,
                args0: [{
                    type: "input_value",
                    name: "MESSAGE",
                }],
                nextStatement: null,
                previousStatement: null,
                shadow: {
                    'MESSAGE': `<shadow type="text"></shadow>`,
                },
            };
        },
        javascript: (part) => {
            return function (block) {
                let value = Blockly.JavaScript.valueToCode(block, 'MESSAGE');
                return `devices.get('${part.id}').print(${value});`;
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'clear',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_TERMINAL_CLEAR}`,
                nextStatement: null,
                previousStatement: null
            };
        },
        javascript: (part) => {
            return function () {
                return `devices.get('${part.id}').clear();`;
            };
        },
    }],
};

export default terminal;
