/**
 * Registers the logic blocks, and creates its category
 */
const COLOR = '#f75846';

class BlocklyLogic {
    static get type() { return 'blockly'; }
    static get id() { return 'logic'; }
    static get color() { return COLOR; }
    static register(Blockly) {
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
                const labels = {
                    EQ: '= equal',
                    NEQ: '\u2260 not equal',
                    LT: '< less than',
                    LTE: '\u2264 less than or equal',
                    GT: '> greater than',
                    GTE: '\u2265 greater than or equal',
                };
                this.appendValueInput('A');

                this.appendDummyInput()
                    .appendField(new Blockly.FieldCustomDropdown(options, labels), 'OP');

                this.appendValueInput('B');

                this.setInputsInline(true);
                this.setOutput('Boolean');
                this.setColour(COLOR);
                this.setHelpUrl('%{BKY_LOGIC_COMPARE_HELPURL}');
            },
        };
        // Assign custom color to blockly core blocks
        [
            'controls_if',
            'logic_compare',
            'logic_operation',
            'logic_negate',
            'logic_boolean',
        ].forEach((blockId) => {
            Blockly.Blocks[blockId].customColor = COLOR;
        });
    }
    static get category() {
        return {
            name: Blockly.Msg.CATEGORY_LOGIC,
            id: BlocklyLogic.id,
            colour: COLOR,
            blocks: [
                'controls_if',
                'logic_compare',
                'logic_operation',
                'logic_negate',
                'logic_boolean',
            ],
        };
    }
    static get defaults() {
        return {
            logic_compare: {
                OP: 'EQ',
            },
            logic_boolean: {
                BOOL: 'TRUE',
            },
        };
    }
}

export default BlocklyLogic;
