(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOUR = '#f6b231';

    let register = (Blockly) => {

        /* --- max(x, y) */
        Blockly.Blocks.math_min_max = {
            init: function () {
                let json = {
                    id: 'math_max',
                    colour: COLOUR,
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

        Blockly.Pseudo.math_min_max = (block) => {
            let arg1 = Blockly.Pseudo.valueToCode(block, 'ARG1') || 0,
                arg2 = Blockly.Pseudo.valueToCode(block, 'ARG2') || 0,
                minmax = block.getFieldValue('MINMAX') || 'min',
                code = `Math.${minmax}(${arg1}, ${arg2})`;
            return [code];
        };

        /* --- max(x, y) */
        Blockly.Blocks.math_max = {
            init: function () {
                let json = {
                    id: 'math_max',
                    colour: COLOUR,
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

        Blockly.Pseudo.math_max = (block) => {
            let arg1 = Blockly.Pseudo.valueToCode(block, 'ARG1') || 0,
                arg2 = Blockly.Pseudo.valueToCode(block, 'ARG2') || 0,
                code = `maximum(${arg1}, ${arg2})`;
            return [code];
        };

        /* --- min(x, y) */
        Blockly.Blocks.math_min = {
            init: function () {
                let json = {
                    id: 'math_min',
                    colour: COLOUR,
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

        Blockly.Pseudo.math_min = (block) => {
            let arg1 = Blockly.Pseudo.valueToCode(block, 'ARG1') || 0,
                arg2 = Blockly.Pseudo.valueToCode(block, 'ARG2') || 0,
                code = `minimum(${arg1}, ${arg2})`;
            return [code];
        };

        /* --- sign(x) */
        Blockly.Blocks.math_sign = {
            init: function () {
                let json = {
                    id: 'math_sign',
                    colour: COLOUR,
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

        Blockly.Pseudo.math_sign = (block) => {
            let arg = Blockly.Pseudo.valueToCode(block, 'ARG'),
                code = `sign(${arg})`;
            return [code];
        };

        /* --- random(min, max) */
        Blockly.Blocks.math_random = {
            init: function () {
                let json = {
                    id: 'math_random',
                    colour: COLOUR,
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

        Blockly.Pseudo.math_random = (block) => {
            let min = Blockly.Pseudo.valueToCode(block, 'MIN') || 0,
                max = Blockly.Pseudo.valueToCode(block, 'MAX') || 100,
                code = `math.random(${min}, ${max})`;
            return [code];
        };

        Blockly.Pseudo.math_single = (block) => {
            // Math operators with single operand.
            let operator = block.getFieldValue('OP'),
                code,
                arg;
            if (operator == 'NEG') {
                // Negation is a special case given its different operator precedence.
                arg = Blockly.Pseudo.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_UNARY_NEGATION) || '0';
                if (arg[0] == '-') {
                    // --3 is not legal in JS.
                    arg = ' ' + arg;
                }
                code = '-' + arg;
                return [code, Blockly.JavaScript.ORDER_UNARY_NEGATION];
            }
            if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
                arg = Blockly.Pseudo.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_DIVISION) || '0';
            } else {
                arg = Blockly.Pseudo.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_NONE) || '0';
            }
            // First, handle cases which generate values that don't need parentheses
            // wrapping the code.
            switch (operator) {
                case 'ABS':
                    code = 'absolute(' + arg + ')';
                    break;
                case 'ROOT':
                    code = 'squareroot(' + arg + ')';
                    break;
                case 'LN':
                    code = 'logarithm(' + arg + ')';
                    break;
                case 'EXP':
                    code = 'exponential(' + arg + ')';
                    break;
                case 'POW10':
                    code = 'power(10,' + arg + ')';
                    break;
                case 'ROUND':
                    code = 'round(' + arg + ')';
                    break;
                case 'ROUNDUP':
                    code = 'ceiling(' + arg + ')';
                    break;
                case 'ROUNDDOWN':
                    code = 'floor(' + arg + ')';
                    break;
                case 'SIN':
                    code = 'sine(' + arg + ')';
                    break;
                case 'COS':
                    code = 'cosine(' + arg + ')';
                    break;
                case 'TAN':
                    code = 'tangent(' + arg + ')';
                    break;
            }
            if (code) {
                return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
            }
            // Second, handle cases which generate values that may need parentheses
            // wrapping the code.
            switch (operator) {
                case 'LOG10':
                    code = 'logarithm10(' + arg + ')';
                    break;
                case 'ASIN':
                    code = 'asine(' + arg + ')';
                    break;
                case 'ACOS':
                    code = 'acosine(' + arg + ')';
                    break;
                case 'ATAN':
                    code = 'atangent(' + arg + ')';
                    break;
                default:
                    throw 'Unknown math operator: ' + operator;
            }
            return [code, Blockly.JavaScript.ORDER_DIVISION];
        };

        Blockly.Pseudo.math_constrain = (block) => {
            // Constrain a number between two limits.
            let argument0 = Blockly.Pseudo.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_COMMA) || '0';
            let argument1 = Blockly.Pseudo.valueToCode(block, 'LOW', Blockly.JavaScript.ORDER_COMMA) || '0';
            let argument2 = Blockly.Pseudo.valueToCode(block, 'HIGH', Blockly.JavaScript.ORDER_COMMA) || 'Infinity';
            let code = `constrain(${argument0}, ${argument1}, ${argument2})`;
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        };

        Blockly.Pseudo.math_constant = (block) => {
            // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
            const CONSTANTS = {
                'PI': ['PI', Blockly.JavaScript.ORDER_MEMBER],
                'E': ['E', Blockly.JavaScript.ORDER_MEMBER],
                'GOLDEN_RATIO': ['GOLDEN_RATIO', Blockly.JavaScript.ORDER_DIVISION],
                'SQRT2': ['SQRT2', Blockly.JavaScript.ORDER_MEMBER],
                'SQRT1_2': ['SQRT1_2', Blockly.JavaScript.ORDER_MEMBER],
                'INFINITY': ['Infinity', Blockly.JavaScript.ORDER_ATOMIC]
            };
            return CONSTANTS[block.getFieldValue('CONSTANT')];
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
                code = `${leftHand} ${op} ${rightHand};\n`;
            return code;
        };
        Blockly.Pseudo.unary = (block) => {
            let leftHand = block.getFieldValue('LEFT_HAND'),
                op = block.getFieldValue('OPERATOR') || '+=',
                rightHand = Blockly.JavaScript.valueToCode(block, 'RIGHT_HAND'),
                code = `${leftHand} ${op} ${rightHand};\n`;
            return code;
        };

        Blockly.Pseudo.math_arithmetic = Blockly.JavaScript.math_arithmetic;
        Blockly.Pseudo.math_trig = Blockly.Pseudo.math_single;
        Blockly.Pseudo.math_round = Blockly.Pseudo.math_single;
        Blockly.Pseudo.math_number_property = Blockly.JavaScript.math_number_property;
        Blockly.Pseudo.math_modulo = Blockly.JavaScript.math_modulo;

        category.blocks.forEach((category) => {
            Kano.BlocklyUtil.updateBlockColour(Blockly.Blocks[category.id], COLOUR);
        });
    };

    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: 'Math',
        id: 'math',
        colour: COLOUR,
        blocks: [
            'math_arithmetic',
            {
                id: 'unary',
                defaults: ['RIGHT_HAND']
            },{
                id: 'math_random',
                defaults: ['MIN', 'MAX']
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

    Kano.MakeApps.Blockly.setLookupString('math_arithmetic', 'add(a, b)');
    Kano.MakeApps.Blockly.setLookupString('math_arithmetic', 'substract(a, b)');
    Kano.MakeApps.Blockly.setLookupString('math_arithmetic', 'multiply(a, b)');
    Kano.MakeApps.Blockly.setLookupString('math_arithmetic', 'divide(a, b)');
    Kano.MakeApps.Blockly.setLookupString('math_arithmetic', '+');
    Kano.MakeApps.Blockly.setLookupString('math_arithmetic', '-');
    Kano.MakeApps.Blockly.setLookupString('math_arithmetic', '/');
    Kano.MakeApps.Blockly.setLookupString('math_arithmetic', 'x');
    Kano.MakeApps.Blockly.setLookupString('unary', 'addTo(variable, value)');
    Kano.MakeApps.Blockly.setLookupString('unary', 'substractTo(variable, value)');
    Kano.MakeApps.Blockly.setLookupString('math_random', 'randomNumberBetween(a, b)');
    Kano.MakeApps.Blockly.setLookupString('math_single', 'math');
    Kano.MakeApps.Blockly.setLookupString('math_trig', 'math');
    Kano.MakeApps.Blockly.setLookupString('math_constant', 'math');
    Kano.MakeApps.Blockly.setLookupString('math_number_property', 'math');
    Kano.MakeApps.Blockly.setLookupString('math_round', 'round(a)');
    Kano.MakeApps.Blockly.setLookupString('math_modulo', 'math');
    Kano.MakeApps.Blockly.setLookupString('math_constrain', 'math');
    Kano.MakeApps.Blockly.setLookupString('math_min_max', 'min(a, b)');
    Kano.MakeApps.Blockly.setLookupString('math_min_max', 'max(a, b)');
    Kano.MakeApps.Blockly.setLookupString('math_sign', 'math');

    Kano.MakeApps.Blockly.addModule('math', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
