import { Blockly, Block, utils } from '@kano/kwc-blockly/blockly.js';
import { MathModule } from './math.js';
import { _ } from '../../i18n/index.js';

const COLOR = '#ff9800';

const arithmeticOptions : { [K : string] : string } = {
    ADD: '%{BKY_MATH_ADDITION_SYMBOL} add',
    MINUS: '%{BKY_MATH_SUBTRACTION_SYMBOL} subtract',
    MULTIPLY: '%{BKY_MATH_MULTIPLICATION_SYMBOL} multiply',
    DIVIDE: '%{BKY_MATH_DIVISION_SYMBOL} divide',
    POWER: '%{BKY_MATH_POWER_SYMBOL} to the power of',
};

const minMaxOptions = [
    [_('MIN', 'min'), 'min'],
    [_('MAX', 'max'), 'max'],
];

const unaryOptions = [
    ['+=', '+='],
    ['-=', '-='],
    ['*=', '*='],
    ['/=', '/='],
];

function processBlocklyMessages(options : [string, string][]) {
    return options.map(([label, value]) => [utils.replaceMessageReferences(label), value]);
}

export const MathAPI = {
    type: 'blockly',
    id: MathModule.id,
    name: MathModule.id,
    typeScriptDefinition: `
        declare namespace math {
            declare function random(min: number, max: number): number;
            declare function lerp(from: number, to: number, percent: number): number;
        }
    `,
    register(Blockly : Blockly) {
        Blockly.Blocks.math_arithmetic = {
            init() {
                const options = [
                    ['%{BKY_MATH_ADDITION_SYMBOL}', 'ADD'],
                    ['%{BKY_MATH_SUBTRACTION_SYMBOL}', 'MINUS'],
                    ['%{BKY_MATH_MULTIPLICATION_SYMBOL}', 'MULTIPLY'],
                    ['%{BKY_MATH_DIVISION_SYMBOL}', 'DIVIDE'],
                    ['%{BKY_MATH_POWER_SYMBOL}', 'POWER'],
                ];
                this.appendValueInput('A')
                    .setCheck('Number');

                this.appendDummyInput()
                    .appendField(new Blockly.FieldCustomDropdown(options, arithmeticOptions), 'OP');

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
                        options: minMaxOptions,
                    }],
                    inputsInline: true,
                    output: 'Number',
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.math_min_max = (block : Block) => {
            let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_COMMA) || 0,
                arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2', Blockly.JavaScript.ORDER_COMMA) || 0,
                minmax = block.getFieldValue('MINMAX') || 'min',
                code = `Math.${minmax}(${arg1}, ${arg2})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        };

        /* --- max(x, y) */
        Blockly.Blocks.math_max = {
            init() {
                const json = {
                    id: 'math_max',
                    colour: COLOR,
                    message0: `${_('MAX', 'max')} %1 %2`,
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

        Blockly.JavaScript.math_max = (block : Block) => {
            let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_COMMA) || 0,
                arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2', Blockly.JavaScript.ORDER_COMMA) || 0,
                code = `Math.max(${arg1}, ${arg2})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        };

        /* --- min(x, y) */
        Blockly.Blocks.math_min = {
            init() {
                const json = {
                    id: 'math_min',
                    colour: COLOR,
                    message0: `${_('MIN', 'min')} %1 %2`,
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

        Blockly.JavaScript.math_min = (block : Block) => {
            let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_COMMA) || 0,
                arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2', Blockly.JavaScript.ORDER_COMMA) || 0,
                code = `Math.min(${arg1}, ${arg2})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        };

        /* --- sign(x) */
        Blockly.Blocks.math_sign = {
            init() {
                const json = {
                    id: 'math_sign',
                    colour: COLOR,
                    message0: `${_('SIGN', 'sign')} %1`,
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

        Blockly.JavaScript.math_sign = (block : Block) => {
            let arg = Blockly.JavaScript.valueToCode(block, 'ARG', Blockly.JavaScript.ORDER_NONE),
                code = `math.sign(${arg}})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        };

        /* --- random(min, max) */
        Blockly.Blocks.math_random = {
            init() {
                const json = {
                    id: 'math_random',
                    colour: COLOR,
                    message0: _('BLOCK_RANDOM_NUMBER_BETWEEN', 'random number from %1 to %2'),
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

        Blockly.JavaScript.math_random = (block : Block) => {
            let min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_COMMA) || 0,
                max = Blockly.JavaScript.valueToCode(block, 'MAX', Blockly.JavaScript.ORDER_COMMA) || 0,
                code = `math.random(${min}, ${max})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
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

        Blockly.JavaScript.math_lerp = (block : Block) => {
            let from = Blockly.JavaScript.valueToCode(block, 'FROM', Blockly.JavaScript.ORDER_COMMA) || 0,
                to = Blockly.JavaScript.valueToCode(block, 'TO', Blockly.JavaScript.ORDER_COMMA) || 200,
                percent = Blockly.JavaScript.valueToCode(block, 'PERCENT', Blockly.JavaScript.ORDER_COMMA) || 50,
                code = `math.lerp(${from}, ${to}, ${percent})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        };

        Blockly.JavaScript.math_arithmetic = (block : Block) => {
            // Basic arithmetic operators, and power.
            let OPERATORS : { [K : string] : any } = {
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
                code = `Math.pow(${argument0}, ${argument1})`;
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
                        options: unaryOptions,
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

        Blockly.JavaScript.unary = (block : Block) => {
            const op = block.getFieldValue('OPERATOR') || '+=';
            let rightHand = Blockly.JavaScript.valueToCode(block, 'RIGHT_HAND', Blockly.JavaScript.ORDER_ASSIGNMENT);

            const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('LEFT_HAND'), Blockly.Variables.NAME_TYPE);

            // Default to 1 for multiplication and division, otherwise default to 0
            if (['/=', '*='].indexOf(op) !== -1) {
                rightHand = rightHand || 1;
            } else {
                rightHand = rightHand || 0;
            }
            return `${varName} ${op} ${rightHand};\n`;
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
        id: MathModule.id,
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
            NUM: '0',
        },
        math_arithmetic: {
            A: 0,
            OP: 'ADD',
            B: 0,
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
        math_modulo: {
            DIVIDEND: 0,
            DIVISOR: 0,
        },
        math_constrain: {
            VALUE: 0,
            LOW: 0,
            HIGH: 0,
        },
        math_min_max: {
            MINMAX: 'min',
            ARG1: 0,
            ARG2: 0,
        },
        math_number_property: {
            PROPERTY: "EVEN",
            NUMBER_TO_CHECK: 0,
        },
        math_single: {
            OP: "ROOT"
        },
        math_round: {
            OP: "ROUND"
        },
        math_sign: {
            ARG: 0,
        }
    },
    labels: {
        math_arithmetic: {
            OP: Object.keys(arithmeticOptions).map(value => [utils.replaceMessageReferences(arithmeticOptions[value]), value])
        },
        math_unary: {
            OPERATOR: unaryOptions,
        },
        math_trig: {
            OP: [
                ['sin', 'SIN'],
                ['cos', 'COS'],
                ['tan', 'TAN'],
                ['asin', 'ASIN'],
                ['acos', 'ACOS'],
                ['atan', 'ATAN'],
            ],
        },
        math_constant: {
            CONSTANT: [["\u03c0", "PI"], ["e", "E"], ["\u03c6", "GOLDEN_RATIO"], ["sqrt(2)", "SQRT2"], ["sqrt(\u00bd)", "SQRT1_2"], ["\u221e", "INFINITY"]],
        },
        math_min_max: {
            MINMAX: minMaxOptions,
        },
        math_number_property: {
            PROPERTY: processBlocklyMessages([["%{BKY_MATH_IS_EVEN}", "EVEN"], ["%{BKY_MATH_IS_ODD}", "ODD"], ["%{BKY_MATH_IS_PRIME}", "PRIME"], ["%{BKY_MATH_IS_WHOLE}", "WHOLE"], ["%{BKY_MATH_IS_POSITIVE}", "POSITIVE"], ["%{BKY_MATH_IS_NEGATIVE}", "NEGATIVE"], ["%{BKY_MATH_IS_DIVISIBLE_BY}", "DIVISIBLE_BY"]]),
        },
        math_single: {
            OP: processBlocklyMessages([["%{BKY_MATH_SINGLE_OP_ROOT}", "ROOT"], ["%{BKY_MATH_SINGLE_OP_ABSOLUTE}", "ABS"], ["-", "NEG"], ["ln", "LN"], ["log10", "LOG10"], ["e^", "EXP"], ["10^", "POW10"]]),
        },
        math_round: {
            OP: processBlocklyMessages([["%{BKY_MATH_ROUND_OPERATOR_ROUND}", "ROUND"], ["%{BKY_MATH_ROUND_OPERATOR_ROUNDUP}", "ROUNDUP"], ["%{BKY_MATH_ROUND_OPERATOR_ROUNDDOWN}", "ROUNDDOWN"]]),
        },
    }
};

export default MathAPI;
