const COLOR = '#ffc100';

const ID = 'variables';

const BlocklyVariables = {
    type: 'blockly',
    id: ID,
    register(Blockly) {
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
        name: Blockly.Msg.CATEGORY_VARIABLES,
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
    },
};

export default BlocklyVariables;
