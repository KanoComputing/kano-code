import { localize } from '../../i18n/index.js';

const text = {
    partType: 'ui',
    type: 'text',
    label: localize('PART_TEXT_NAME'),
    image: '/assets/part/text.svg',
    colour: '#607d8b',
    customizable: {
        style: ['color', 'font-size', 'font-family'],
        properties: [{
            key: 'text',
            type: 'text',
            label: localize('TEXT')
        }]
    },
    userStyle: {
        color: '#000000',
        'font-size': '1em',
        'font-family': 'Bariol'
    },
    userProperties: {
        text: localize('TEXT_DEFAULT')
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'set_value',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_TEXT_SET}`,
                args0: [{
                    type: "input_value",
                    name: "INPUT"
                }],
                nextStatement: null,
                previousStatement: null,
            };
        },
        javascript: (ui) => {
            return function (block) {
                let value = Blockly.JavaScript.valueToCode(block, 'INPUT');
                return `devices.get('${ui.id}').setValue(${value});`;
            };
        },
    },
    {
        block: (ui) => {
            return {
                id: 'get_text',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_TEXT_TEXT}`,
                output: 'String'
            }
        },
        javascript: (ui) => {
            return function (block) {
                return [`devices.get('${ui.id}').getValue()`];
            };
        },
    }],
    events: [{
        label: Blockly.Msg.BLOCK_IS_CLICKED,
        id: 'clicked',
    }],
};

export default text;
