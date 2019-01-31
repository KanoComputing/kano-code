const COLOR = '#ff9800';

const ID = 'math';

export const MathAPI = {
    type: 'blockly',
    id: ID,
    typeScriptDefinition: `
        declare namespace math {
            declare function random(min: number, max: number): number;
            declare function lerp(from: number, to: number, percent: number): number;
        }
    `,
    register(Blockly) {
        Blockly.Blocks.math_arithmetic = {
            init() {
                const options = [
                    ['%{BKY_MATH_ADDITION_SYMBOL}', 'ADD'],
                    ['%{BKY_MATH_SUBTRACTION_SYMBOL}', 'MINUS'],
                    ['%{BKY_MATH_MULTIPLICATION_SYMBOL}', 'MULTIPLY'],
                    ['%{BKY_MATH_DIVISION_SYMBOL}', 'DIVIDE'],
                    ['%{BKY_MATH_POWER_SYMBOL}', 'POWER'],
                ];
                const labels = {
                    ADD: '%{BKY_MATH_ADDITION_SYMBOL} add',
                    MINUS: '%{BKY_MATH_SUBTRACTION_SYMBOL} substract',
                    MULTIPLY: '%{BKY_MATH_MULTIPLICATION_SYMBOL} multiply',
                    DIVIDE: '%{BKY_MATH_DIVISION_SYMBOL} divide',
                    POWER: '%{BKY_MATH_POWER_SYMBOL} to the power of',
                };
                this.appendValueInput('A')
                    .setCheck('Number');

                this.appendDummyInput()
                    .appendField(new Blockly.FieldCustomDropdown(options, labels), 'OP');

                this.appendValueInput('B')
                    .setCheck('Number');

                this.setInputsInline(true);
                this.setOutput('Number');
                this.setColour(COLOR);
                this.setHelpUrl('%{BKY_MATH_ARITHMETIC_HELPURL}');
            },
        };

        /* --- max(x, y) */
        Blockly.Blocks.math_min_max = {
            init() {
                const json = {
                    id: 'math_max',
                    colour: COLOR,
                    message0: '%3 %1 %2',
                    args0: [{
                        type: 'input_value',
                        name: 'ARG1',
                        check: 'Number',
                    }, {
                        type: 'input_value',
                        name: 'ARG2',
                        check: 'Number',
                    }, {
                        type: 'field_dropdown',
                        name: 'MINMAX',
                        options: [
                            ['min', 'min'],
                            ['max', 'max'],
                        ],
                    }],
                    inputsInline: true,
                    output: 'Number',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.math_min_max = (block) => {
            let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1') || 0,
                arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2') || 0,
                minmax = block.getFieldValue('MINMAX') || 'min',
                code = `Math.${minmax}(${arg1}, ${arg2})`;
            return [code];
        };

        /* --- max(x, y) */
        Blockly.Blocks.math_max = {
            init() {
                const json = {
                    id: 'math_max',
                    colour: COLOR,
                    message0: 'max %1 %2',
                    args0: [{
                        type: 'input_value',
                        name: 'ARG1',
                        check: 'Number',
                    }, {
                        type: 'input_value',
                        name: 'ARG2',
                        check: 'Number',
                    }],
                    inputsInline: true,
                    output: 'Number',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.math_max = (block) => {
            let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1') || 0,
                arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2') || 0,
                code = `Math.max(${arg1}, ${arg2})`;
            return [code];
        };

        /* --- min(x, y) */
        Blockly.Blocks.math_min = {
            init() {
                const json = {
                    id: 'math_min',
                    colour: COLOR,
                    message0: 'min %1 %2',
                    args0: [{
                        type: 'input_value',
                        name: 'ARG1',
                        check: 'Number',
                    }, {
                        type: 'input_value',
                        name: 'ARG2',
                        check: 'Number',
                    }],
                    inputsInline: true,
                    output: 'Number',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.math_min = (block) => {
            let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1') || 0,
                arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2') || 0,
                code = `Math.min(${arg1}, ${arg2})`;
            return [code];
        };

        /* --- sign(x) */
        Blockly.Blocks.math_sign = {
            init() {
                const json = {
                    id: 'math_sign',
                    colour: COLOR,
                    message0: 'sign %1',
                    args0: [{
                        type: 'input_value',
                        name: 'ARG',
                        check: 'Number',
                    }],
                    inputsInline: true,
                    output: 'Number',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.math_sign = (block) => {
            let arg = Blockly.JavaScript.valueToCode(block, 'ARG'),
                code = `math.sign(${arg}})`;
            return [code];
        };

        /* --- random(min, max) */
        Blockly.Blocks.math_random = {
            init() {
                const json = {
                    id: 'math_random',
                    colour: COLOR,
                    message0: 'random number from %1 to %2',
                    args0: [{
                        type: 'input_value',
                        name: 'MIN',
                        check: 'Number',
                    }, {
                        type: 'input_value',
                        name: 'MAX',
                        check: 'Number',
                    }],
                    inputsInline: true,
                    output: 'Number',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.math_random = (block) => {
            let min = Blockly.JavaScript.valueToCode(block, 'MIN') || 0,
                max = Blockly.JavaScript.valueToCode(block, 'MAX') || 0,
                code = `math.random(${min}, ${max})`;
            return [code];
        };

        Blockly.Blocks.math_lerp = {
            init() {
                const json = {
                    id: 'math_lerp',
                    colour: COLOR,
                    message0: Blockly.Msg.MATH_LERP,
                    args0: [{
                        type: 'input_value',
                        name: 'FROM',
                        check: 'Number',
                    }, {
                        type: 'input_value',
                        name: 'TO',
                        check: 'Number',
                    }, {
                        type: 'input_value',
                        name: 'PERCENT',
                        check: 'Number',
                    }],
                    inputsInline: true,
                    output: 'Number',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.math_lerp = (block) => {
            let from = Blockly.JavaScript.valueToCode(block, 'FROM') || 0,
                to = Blockly.JavaScript.valueToCode(block, 'TO') || 200,
                percent = Blockly.JavaScript.valueToCode(block, 'PERCENT') || 50,
                code = `math.lerp(${from}, ${to}, ${percent})`;
            return [code];
        };

        Blockly.JavaScript.math_arithmetic = (block) => {
            // Basic arithmetic operators, and power.
            let OPERATORS = {
                    ADD: [' + ', Blockly.JavaScript.ORDER_ADDITION],
                    MINUS: [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
                    MULTIPLY: [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
                    DIVIDE: [' / ', Blockly.JavaScript.ORDER_DIVISION],
                    POWER: [null, Blockly.JavaScript.ORDER_COMMA], // Handle power separately.
                },
                tuple = OPERATORS[block.getFieldValue('OP')],
                operator = tuple[0],
                order = tuple[1],
                argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0',
                argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0',
                code;

            // Avoid division by 0
            if (operator == OPERATORS.DIVIDE[0] && argument1 == '0') {
                argument1 = '1';
            }
            // Power in JavaScript requires a special case since it has no operator.
            if (!operator) {
                code = `Math.pow(${argument0}, ${argument1 })`;
                return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
            }
            code = argument0 + operator + argument1;
            return [code, order];
        };

        Blockly.Blocks.unary = {
            init() {
                const json = {
                    id: 'unary',
                    message0: '%1 %2 %3',
                    args0: [{
                        type: 'field_variable',
                        name: 'LEFT_HAND',
                        variable: Blockly.Msg.VARIABLES_DEFAULT_NAME,
                    }, {
                        type: 'field_dropdown',
                        name: 'OPERATOR',
                        options: [
                            ['+=', '+='],
                            ['-=', '-='],
                            ['*=', '*='],
                            ['/=', '/='],
                        ],
                    }, {
                        type: 'input_value',
                        name: 'RIGHT_HAND',
                        check: 'Number',
                    }],
                    colour: COLOR,
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null,
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.unary = (block) => {
            let leftHand = block.getFieldValue('LEFT_HAND'),
                op = block.getFieldValue('OPERATOR') || '+=',
                rightHand = Blockly.JavaScript.valueToCode(block, 'RIGHT_HAND'),
                code;

            // Default to 1 for multiplication and division, otherwise default to 0
            if (['/=', '*='].indexOf(op) !== -1) {
                rightHand = rightHand || 1;
            } else {
                rightHand = rightHand || 0;
            }
            code = `${leftHand} ${op} ${rightHand};\n`;
            return code;
        };
        // Assign custom color to blockly core blocks
        [
            'math_number',
            'math_arithmetic',
            'math_single',
            'math_trig',
            'math_constant',
            'math_number_property',
            'math_round',
            'math_modulo',
            'math_constrain',
            'math_min_max',
            'math_sign',
        ].forEach((blockId) => {
            Blockly.Blocks[blockId].customColor = COLOR;
        });
    },
    category: {
        get name() {
            return Blockly.Msg.CATEGORY_MATH;
        },
        id: ID,
        colour: COLOR,
        blocks: [
            'math_number',
            'math_arithmetic',
            {
                id: 'unary',
                defaults: ['RIGHT_HAND'],
            }, {
                id: 'math_random',
                defaults: ['MIN', 'MAX'],
            }, {
                id: 'math_lerp',
                defaults: ['FROM', 'TO', 'PERCENT'],
            }, {
                id: 'math_trig',
                defaults: ['SIN'],
            },
            'math_single',
            'math_constant',
            'math_number_property',
            'math_round',
            'math_modulo',
            'math_constrain',
            'math_min_max',
            'math_sign',
        ],
    },
    defaults: {
        math_number: {
            NUM: 0,
        },
        math_arithmetic: {
            OP: 'ADD',
        },
        unary: {
            LEFT_HAND: 'item',
            OPERATOR: '+=',
            RIGHT_HAND: 1,
        },
        math_random: {
            TYPE: 'integer',
            MIN: 0,
            MAX: 10,
        },
        math_lerp: {
            FROM: 0,
            TO: 200,
            PERCENT: 50,
        },
        math_trig: {
            OP: 'SIN',
        },
        math_constant: {
            CONSTANT: "PI"
        },
        math_number_property: {
            PROPERTY: "ODD"
        },
        math_single: {
            OP: "ROOT"
        },
        math_round: {
            OP: "ROUND"
        },
    },
};

export default MathAPI;
