import { Blockly } from '@kano/kwc-blockly/blockly.js';

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

export const ListsAPI = {
    type: 'blockly',
    id: ID,
    register(Blockly : Blockly) {
        CORE_BLOCKS.forEach((blockId) => {
            Blockly.Blocks[blockId].customColor = COLOR;
        });
    },
    category: {
        get name() {
            return Blockly.Msg.CATEGORY_LISTS;
        },
        id: ID,
        colour: COLOR,
        blocks: CORE_BLOCKS,
    },
    defaults: {
        lists_indexOf: {
            END: 'FIRST',
        },
        lists_getIndex: {
            MODE: 'GET',
            WHERE: 'FROM_START',
        },
        lists_setIndex: {
            MODE: 'SET',
            WHERE: 'FROM_START',
        },
    },
    labels: {
        lists_indexOf: {
            END: [[Blockly.Msg.LISTS_INDEX_OF_FIRST, "FIRST"], [Blockly.Msg.LISTS_INDEX_OF_LAST, "LAST"]],
        },
        lists_getIndex: {
            MODE: [[Blockly.Msg.LISTS_GET_INDEX_GET, "GET"], [Blockly.Msg.LISTS_GET_INDEX_GET_REMOVE, "GET_REMOVE"], [Blockly.Msg.LISTS_GET_INDEX_REMOVE, "REMOVE"]],
            WHERE: [[Blockly.Msg.LISTS_GET_INDEX_FROM_START, "FROM_START"], [Blockly.Msg.LISTS_GET_INDEX_FROM_END, "FROM_END"], [Blockly.Msg.LISTS_GET_INDEX_FIRST, "FIRST"], [Blockly.Msg.LISTS_GET_INDEX_LAST, "LAST"], [Blockly.Msg.LISTS_GET_INDEX_RANDOM, "RANDOM"]],
        },
        lists_setIndex: {
            MODE: [[Blockly.Msg.LISTS_SET_INDEX_SET, "SET"], [Blockly.Msg.LISTS_SET_INDEX_INSERT, "INSERT"]],
            WHERE: [[Blockly.Msg.LISTS_GET_INDEX_FROM_START, "FROM_START"], [Blockly.Msg.LISTS_GET_INDEX_FROM_END, "FROM_END"], [Blockly.Msg.LISTS_GET_INDEX_FIRST, "FIRST"], [Blockly.Msg.LISTS_GET_INDEX_LAST, "LAST"], [Blockly.Msg.LISTS_GET_INDEX_RANDOM, "RANDOM"]],
        },
    }
};

export default ListsAPI;
