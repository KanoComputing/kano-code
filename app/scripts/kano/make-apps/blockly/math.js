(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOR = '#ff9800';

    let register = (Blockly) => {

        Blockly.Blocks.math_arithmetic = {
            init: function () {
                let options = [
                    { label: "%{BKY_MATH_ADDITION_SYMBOL} add", textLabel: "%{BKY_MATH_ADDITION_SYMBOL}", value: "ADD" },
                    { label: "%{BKY_MATH_SUBTRACTION_SYMBOL} substract", textLabel: "%{BKY_MATH_SUBTRACTION_SYMBOL}", value: "MINUS" },
                    { label: "%{BKY_MATH_MULTIPLICATION_SYMBOL} multiply", textLabel: "%{BKY_MATH_MULTIPLICATION_SYMBOL}", value: "MULTIPLY" },
                    { label: "%{BKY_MATH_DIVISION_SYMBOL} divide", textLabel: "%{BKY_MATH_DIVISION_SYMBOL}", value: "DIVIDE" },
                    { label: "%{BKY_MATH_POWER_SYMBOL} to the power of", textLabel: "%{BKY_MATH_POWER_SYMBOL}", value: "POWER" }
                ]
                this.appendValueInput('A')
                    .setCheck('Number');

                this.appendDummyInput()
                    .appendField(new Blockly.FieldCustomDropdown(options), 'OP');

                this.appendValueInput('B')
                    .setCheck('Number');

                this.setInputsInline(true);
                this.setOutput('Number');
                this.setColour(COLOR);
                this.setHelpUrl('%{BKY_MATH_ARITHMETIC_HELPURL}');
            }
        }

        /* --- max(x, y) */
        Blockly.Blocks.math_min_max = {
            init: function () {
                let json = {
                    id: 'math_max',
                    colour: COLOR,
                    message0: '%3 %1 %2',
                    args0: [{
                        type: "input_value",
                        name: "ARG1",
                        check: "Number"
                    }, {
                        type: "input_value",
                        name: "ARG2",
                        check: "Number"
                    }, {
                        type: 'field_dropdown',
                        name: 'MINMAX',
                        options: [
                            ['min', 'min'],
                            ['max', 'max']
                        ]
                    }],
                    inputsInline: true,
                    output: "Number"
                };
                this.jsonInit(json);
            }
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
            init: function () {
                let json = {
                    id: 'math_max',
                    colour: COLOR,
                    message0: 'max %1 %2',
                    args0: [{
                        type: "input_value",
                        name: "ARG1",
                        check: "Number"
                    }, {
                        type: "input_value",
                        name: "ARG2",
                        check: "Number"
                    }],
                    inputsInline: true,
                    output: "Number"
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.math_max = (block) => {
            let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1') || 0,
                arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2') || 0,
                code = `Math.max(${arg1}, ${arg2})`;
            return [code];
        };

        /* --- min(x, y) */
        Blockly.Blocks.math_min = {
            init: function () {
                let json = {
                    id: 'math_min',
                    colour: COLOR,
                    message0: 'min %1 %2',
                    args0: [{
                        type: "input_value",
                        name: "ARG1",
                        check: "Number"
                    }, {
                        type: "input_value",
                        name: "ARG2",
                        check: "Number"
                    }],
                    inputsInline: true,
                    output: "Number"
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.math_min = (block) => {
            let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1') || 0,
                arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2') || 0,
                code = `Math.min(${arg1}, ${arg2})`;
            return [code];
        };

        /* --- sign(x) */
        Blockly.Blocks.math_sign = {
            init: function () {
                let json = {
                    id: 'math_sign',
                    colour: COLOR,
                    message0: 'sign %1',
                    args0: [{
                        type: "input_value",
                        name: "ARG",
                        check: "Number"
                    }],
                    inputsInline: true,
                    output: "Number"
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.math_sign = (block) => {
            let arg = Blockly.JavaScript.valueToCode(block, 'ARG'),
                code = `math.sign(${arg}})`;
            return [code];
        };

        /* --- random(min, max) */
        Blockly.Blocks.math_random = {
            init: function () {
                let json = {
                    id: 'math_random',
                    colour: COLOR,
                    message0: 'random number from %1 to %2',
                    args0: [{
                        type: "input_value",
                        name: "MIN",
                        check: "Number"
                    }, {
                        type: "input_value",
                        name: "MAX",
                        check: "Number"
                    }],
                    inputsInline: true,
                    output: "Number"
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.math_random = (block) => {
            let min = Blockly.JavaScript.valueToCode(block, 'MIN') || 0,
                max = Blockly.JavaScript.valueToCode(block, 'MAX') || 0,
                code = `math.random(${min}, ${max})`;
            return [code];
        };

        Blockly.Blocks.math_lerp = {
            init: function () {
                let json = {
                    id: 'math_lerp',
                    colour: COLOR,
                    message0: Blockly.Msg.MATH_LERP,
                    args0: [{
                        type: "input_value",
                        name: "FROM",
                        check: "Number"
                    }, {
                        type: "input_value",
                        name: "TO",
                        check: "Number"
                    }, {
                        type: 'input_value',
                        name: 'PERCENT',
                        check: "Number"
                    }],
                    inputsInline: true,
                    output: "Number"
                };
                this.jsonInit(json);
            }
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
                'ADD': [' + ', Blockly.JavaScript.ORDER_ADDITION],
                'MINUS': [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
                'MULTIPLY': [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
                'DIVIDE': [' / ', Blockly.JavaScript.ORDER_DIVISION],
                'POWER': [null, Blockly.JavaScript.ORDER_COMMA]  // Handle power separately.
            },
            tuple = OPERATORS[block.getFieldValue('OP')],
            operator = tuple[0],
            order = tuple[1],
            argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0',
            argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0',
            code;

            // Avoid division by 0
            if (operator == OPERATORS.DIVIDE[0] && argument1 == "0") {
                argument1 = "1";
            }
            // Power in JavaScript requires a special case since it has no operator.
            if (!operator) {
                code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
                return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
            }
            code = argument0 + operator + argument1;
            return [code, order];
        };

        Blockly.Blocks.unary = {
            init: function () {
                let json = {
                    id: 'unary',
                    message0: '%1 %2 %3',
                    args0: [{
                        type: "field_variable",
                        name: "LEFT_HAND",
                        variable: Blockly.Msg.VARIABLES_DEFAULT_NAME
                    },{
                        type: "field_dropdown",
                        name: "OPERATOR",
                        options: [
                            ['+=','+='],
                            ['-=','-='],
                            ['*=','*='],
                            ['/=','/=']
                        ]
                    },{
                        type: "input_value",
                        name: "RIGHT_HAND",
                        check: "Number"
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
                this.jsonInit(json);
            }
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

        Kano.MakeApps.Blockly.Defaults.upgradeCategoryColours('math', COLOR);
    };

    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_MATH,
        id: 'math',
        colour: COLOR,
        blocks: [
            'math_number',
            'math_arithmetic',
            {
                id: 'unary',
                defaults: ['RIGHT_HAND']
            },{
                id: 'math_random',
                defaults: ['MIN', 'MAX']
            }, {
                id: 'math_lerp',
                defaults: ['FROM', 'TO', 'PERCENT']
            },
            'math_single',
            'math_trig',
            'math_constant',
            'math_number_property',
            'math_round',
            'math_modulo',
            'math_constrain',
            'math_min_max',
            'math_sign'
        ]
    });

    Kano.MakeApps.Blockly.addModule('math', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
