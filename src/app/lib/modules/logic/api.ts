import { Blockly } from '@kano/kwc-blockly/blockly.js';
/**
 * Registers the logic blocks, and creates its category
 */
const COLOR = '#f75846';

const ID = 'logic';

const compareOptions : { [K : string] : string } = {
    EQ: '= equal',
    NEQ: '\u2260 not equal',
    LT: '< less than',
    LTE: '\u2264 less than or equal',
    GT: '> greater than',
    GTE: '\u2265 greater than or equal',
};

export const LogicAPI = {
    type: 'blockly',
    id: ID,
    register(Blockly : Blockly) {
        Blockly.Blocks.logic_compare = {
            init() {
                const options = [
                    ['=', 'EQ'],
                    ['\u2260', 'NEQ'],
                    ['<', 'LT'],
                    ['\u2264', 'LTE'],
                    ['>', 'GT'],
                    ['\u2265', 'GTE'],
                ];
                this.appendValueInput('A');

                this.appendDummyInput()
                    .appendField(new Blockly.FieldCustomDropdown(options, compareOptions), 'OP');

                this.appendValueInput('B');

                this.setInputsInline(true);
                this.setOutput('Boolean');
                this.setColour(COLOR);
                this.setHelpUrl('%{BKY_LOGIC_COMPARE_HELPURL}');
            },
        };
        Blockly.Blocks.controls_if_else_custom = Object.assign({}, Blockly.Blocks.controls_if);
        Blockly.JavaScript.controls_if_else_custom = Blockly.JavaScript.controls_if;
        Blockly.Blocks.controls_if_else_custom.init = function () {
            Blockly.Blocks.controls_if.init.call(this);
            this.setFieldValue(JSON.stringify({ elseIfs: this.elseifCount_, else: true, }), 'CONFIG');
        };

        // Assign custom color to blockly core blocks
        [
            'controls_if',
            'controls_if_else_custom',
            'logic_compare',
            'logic_operation',
            'logic_negate',
            'logic_boolean',
        ].forEach((blockId) => {
            Blockly.Blocks[blockId].customColor = COLOR;
        });
    },
    category: {
        get name() {
            return Blockly.Msg.CATEGORY_LOGIC;
        },
        id: ID,
        colour: COLOR,
        blocks: [
            'controls_if',
            'controls_if_else_custom',
            'logic_compare',
            'logic_operation',
            'logic_negate',
            'logic_boolean',
        ],
    },
    defaults: {
        logic_compare: {
            OP: 'EQ',
        },
        logic_boolean: {
            BOOL: 'TRUE',
        },
        logic_operation: {
            OP: 'AND',
        },
    },
    labels: {
        logic_compare: {
            OP: Object.keys(compareOptions).map((value) => [compareOptions[value], value]),
        },
        logic_boolean: {
            BOOL: [['true', 'TRUE'], ['false', 'FALSE']],
        },
        logic_operation: {
            OP: [['and', 'AND'], ['or', 'OR']],
        },
    },
};

export default LogicAPI;
