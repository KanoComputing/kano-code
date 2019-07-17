import { Blockly } from '@kano/kwc-blockly/blockly.js';

const COLOR = '#ffc100';

const ID = 'variables';

export const VariablesAPI = {
    type: 'blockly',
    id: ID,
    name: ID,
    register(Blockly : Blockly) {
        [
            'math_number',
            'text',
            'text_join',
            'variables_set',
            'variables_get',
        ].forEach((blockId) => {
            Blockly.Blocks[blockId].customColor = COLOR;
        });
    },
    category: {
        get name() {
            return Blockly.Msg.CATEGORY_VARIABLES;
        },
        id: ID,
        colour: COLOR,
        blocks: [
            'math_number',
            'text',
            'text_join',
            'variables_set',
            'variables_get',
        ],
    },
    defaults: {
        variables_set: {
            VAR: 'item',
        },
        variables_get: {
            VAR: 'item',
        },
        math_number: {
            NUM: '0',
        },
        text: {
            TEXT: '',
        },
    },
};

export default VariablesAPI;
