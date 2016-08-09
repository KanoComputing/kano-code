/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    /**
     * Registers the logic blocks, and creates its category
     */
    const COLOUR = '#0074cc';

    let register = (Blockly) => {

        Blockly.Pseudo.controls_if = (block) => {
            // If/elseif/else condition.
            let n = 0,
                argument = Blockly.Pseudo.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false',
                branch = Blockly.Pseudo.statementToCode(block, 'DO' + n),
                code = 'if (' + argument + ') {\n' + branch + '}';
            for (n = 1; n <= block.elseifCount_; n++) {
                argument = Blockly.Pseudo.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false';
                branch = Blockly.Pseudo.statementToCode(block, 'DO' + n);
                code += ' else if (' + argument + ') {\n' + branch + '}';
            }
            if (block.elseCount_) {
                branch = Blockly.Pseudo.statementToCode(block, 'ELSE');
                code += ' else {\n' + branch + '}';
            }
            return code + '\n';
        };

        Blockly.Pseudo.logic_compare = (block) => {
            // Comparison operator.
            const OPERATORS = {
                'EQ': '==',
                'NEQ': '!=',
                'LT': '<',
                'LTE': '<=',
                'GT': '>',
                'GTE': '>='
            };
            let operator = OPERATORS[block.getFieldValue('OP')],
                order = (operator == '==' || operator == '!=') ? Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL,
                argument0 = Blockly.Pseudo.valueToCode(block, 'A', order) || '0',
                argument1 = Blockly.Pseudo.valueToCode(block, 'B', order) || '0',
                code = argument0 + ' ' + operator + ' ' + argument1;
            return [code, order];
        };

        category.blocks.forEach((category) => {
            Kano.BlocklyUtil.updateBlockColour(Blockly.Blocks[category.id], COLOUR);
        });
    };

    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: 'Logic',
        id: 'logic',
        colour: COLOUR,
        blocks: [
            'controls_if',
            'logic_compare',
            'logic_operation',
            'logic_negate',
            'logic_boolean'
        ]
    });

    Kano.MakeApps.Blockly.addModule('logic', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
