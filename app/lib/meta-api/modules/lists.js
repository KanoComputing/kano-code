const COLOR = '#ccdd1e';

const ID = 'lists';

const CORE_BLOCKS = [
    'lists_create_empty',
    'lists_create_with',
    'lists_repeat',
    'lists_length',
    'lists_isEmpty',
    'lists_indexOf',
    'lists_getIndex',
    'lists_setIndex',
];

const BlocklyLists = {
    type: 'blockly',
    id: ID,
    register(Blockly) {
        CORE_BLOCKS.forEach((blockId) => {
            Blockly.Blocks[blockId].customColor = COLOR;
        });
    },
    category: {
        name: Blockly.Msg.CATEGORY_LISTS,
        id: ID,
        colour: COLOR,
        blocks: CORE_BLOCKS,
    },
    defaults: {
        lists_getIndex: {
            MODE: 'GET',
        },
        lists_setIndex: {
            MODE: 'SET',
        },
    },
};

export default BlocklyLists;
