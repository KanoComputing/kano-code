import { localize } from '../../../i18n/index.js';
import './kano-ui-text-input.js';

const input = {
    partType: 'ui',
    type: 'text-input',
    label: localize('PART_TEXT_INPUT_NAME'),
    image: '/assets/part/text-input.svg',
    colour: '#3CAA36',
    customizable: {
        style: [],
        properties: [{
            key: 'value',
            type: 'text',
            label: localize('TEXT'),
        }, {
            key: 'placeholder',
            type: 'text',
            label: localize('PLACEHOLDER'),
        }],
    },
    userProperties: {
        placeholder: localize('BLOCK_TEXT_INPUT_TYPE_IN'),
    },
    events: [{
        label: Blockly.Msg.BLOCK_TEXT_INPUT_CHANGED,
        id: 'input-keyup',
    }],
    blocks: [{
        block: ui => ({
            id: 'input_text_get_value',
            output: 'String',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_VALUE}`,
        }),
        javascript: ui => function () {
            return [`devices.get('${ui.id}').getValue()`];
        },
    }, {
        block: ui => ({
            id: 'input_text_get_placeholder',
            output: 'String',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_TEXT_INPUT_PLACEHOLDER}`,
        }),
        javascript: ui => function () {
            return [`devices.get('${ui.id}').getPlaceholder()`];
        },
    }, {
        block: ui => ({
            id: 'input_text_set_value',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_TEXT_INPUT_SET_VALUE}`,
            args0: [{
                type: 'input_value',
                name: 'INPUT',
            }],
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: ui => function (block) {
            const value = Blockly.JavaScript.valueToCode(block, 'INPUT');
            return `devices.get('${ui.id}').setValue(${value});`;
        },
    }, {
        block: ui => ({
            id: 'input_text_set_placeholder',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_TEXT_INPUT_SET_PLACEHOLDER}`,
            args0: [{
                type: 'input_value',
                name: 'PLACEHOLDER',
            }],
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: ui => function (block) {
            const placeholder = Blockly.JavaScript.valueToCode(block, 'PLACEHOLDER');
            return `devices.get('${ui.id}').setPlaceholder(${placeholder});`;
        },
    }],
};

export default input;
