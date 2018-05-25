import { localize } from '../../i18n/index.js';

const button = {
    partType: 'ui',
    type: 'button',
    label: localize('PART_BUTTON_NAME'),
    image: '/assets/part/button.svg',
    colour: '#3f51b5',
    customizable: {
        properties: [{
            key: 'label',
            type: 'text',
            label: localize('LABEL')
        }],
        style: ['background-color'],
    },
    userProperties: {
        label: localize('CLICK_ME')
    },
    userStyle: {
        'background-color': '#3caa36',
    },
    events: [{
        label: localize('IS_CLICKED'),
        id: 'clicked',
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'get_label',
                output: 'String',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_BUTTON_LABEL}`,
            };
        },
        javascript: (ui) => {
            return function () {
                return [`devices.get('${ui.id}').getLabel()`];
            };
        },
    }, {
        block: (ui) => {
            return {
                id: 'set_label',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_BUTTON_SET_LABEL}`,
                args0: [{
                    type: "input_value",
                    name: "LABEL",
                }],
                previousStatement: null,
                nextStatement: null,
            };
        },
        javascript: (ui) => {
            return function (block) {
                let label = Blockly.JavaScript.valueToCode(block, 'LABEL');
                return `devices.get('${ui.id}').setLabel(${label});`;
            };
        },
    }, {
        block: (ui) => {
            return {
                id: 'set_background_colour',
                lookup: 'setBackgroundColor(color)',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_SET_BACKGROUND_COLOR}`,
                args0: [{
                    type: "input_value",
                    name: "COLOUR",
                    check: "Colour",
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
                return `devices.get('${ui.id}').setBackgroundColour(${colour});`;
            };
        },
    }, {
        block: (ui) => {
            return {
                id: 'set_text_colour',
                lookup: 'setColor(color)',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_BUTTON_SET_TEXT_COLOR}`,
                args0: [{
                    type: "input_value",
                    name: "COLOUR",
                    check: "Colour"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
                return `devices.get('${ui.id}').setColour(${colour});`;
            };
        },
    }],
};

export default button;
