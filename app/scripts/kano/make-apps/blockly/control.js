/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOR = '#1198ff';

    let register = (Blockly) => {
        Blockly.Blocks.loop_forever = {
            init: function () {
                let json = {
                    id: 'loop_forever',
                    colour: COLOR,
                    message0: `${Blockly.Msg.LOOP_FOREVER_REPEAT} %1 %2`,
                    args0: [
                    {
                        type: "input_dummy"
                    },
                    {
                        type: "input_statement",
                        name: "DO"
                    }],
                    message1: Blockly.Msg.LOOP_FOREVER_FOREVER,
                    previousStatement: null,
                    nextStatement: null
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.loop_forever = (block) => {
            let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                code = `loop.forever(function () {\n${statement}});\n`;
            return code;
        };


        Blockly.Blocks.every_x_seconds = {
            init: function () {
                let json = {
                    id: 'every_x_seconds',
                    colour: COLOR,
                    message0: `${Blockly.Msg.LOOP_EVERY_REPEAT} %1 %2`,
                    args0: [{
                        type: "input_value",
                        name: "INTERVAL"
                    },{
                        type: "field_dropdown",
                        name: "UNIT",
                        options: [
                            [
                                'seconds',
                                'seconds'
                            ],
                            [
                                'milliseconds',
                                'milliseconds'
                            ],
                            [
                                'frames',
                                'frames'
                            ]
                        ]
                    }],
                    message1: `${Blockly.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
                    args1: [{
                        type: "input_statement",
                        name: "DO"
                    }],
                    previousStatement: null,
                    nextStatement: null
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.every_x_seconds = (block) => {
            let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                interval = Blockly.JavaScript.valueToCode(block, 'INTERVAL') || 5,
                unit = block.getFieldValue('UNIT') || 'seconds',
                code = `time.every(${interval}, '${unit}', function () {\n${statement}});\n`;
            return code;
        };

        Blockly.Blocks.in_x_time = {
            init: function () {
                let json = {
                    id: 'in_x_time',
                    colour: COLOR,
                    message0: Blockly.Msg.LOOP_IN,
                    args0: [{
                        type: "input_value",
                        name: "DELAY"
                    },{
                        type: "field_dropdown",
                        name: "UNIT",
                        options: [
                            [
                                'seconds',
                                'seconds'
                            ],
                            [
                                'milliseconds',
                                'milliseconds'
                            ]
                        ]
                    }],
                    message1: `${Blockly.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
                    args1: [{
                        type: "input_statement",
                        name: "DO"
                    }],
                    previousStatement: null,
                    nextStatement: null
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.in_x_time = (block) => {
            let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                delay = Blockly.JavaScript.valueToCode(block, 'DELAY') || 1,
                unit = block.getFieldValue('UNIT') || 'seconds',
                code = `time.later(${delay}, '${unit}', function () {\n${statement}});\n`;
            return code;
        };

        Blockly.Blocks.repeat_x_times = {
            init: function () {
                let json = {
                    id: 'repeat_x_times',
                    colour: COLOR,
                    message0: Blockly.Msg.LOOP_X_TIMES_REPEAT,
                    args0: [{
                        type: "input_value",
                        name: "N"
                    }],
                    message1: '%1',
                    args1: [{
                        type: "input_statement",
                        name: "DO"
                    }],
                    previousStatement: null,
                    nextStatement: null
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.repeat_x_times = (block) => {
            let n = Blockly.JavaScript.valueToCode(block, 'N') || 2,
                code,
                branch = Blockly.JavaScript.statementToCode(block, 'DO'),
                loopVar = Blockly.JavaScript.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
            branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
            code = `for (var ${loopVar} = 0; ${loopVar} < ${n}; ${loopVar}++) {\n${branch}}\n`;
            return code;
        };

        Blockly.Blocks.restart_code = {
            init: function () {
                let json = {
                    id: 'restart_code',
                    colour: COLOR,
                    message0: Blockly.Msg.RESTART_CODE,
                    previousStatement: null,
                    nextStatement: null
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.restart_code = (block) => {
            return 'global.restartCode();';
        };

        Kano.MakeApps.Blockly.Defaults.upgradeCategoryColours('control', COLOR);
        
    };
    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_CONTROL,
        id: 'control',
        colour: COLOR,
        blocks: [
            {
                id: 'repeat_x_times',
                defaults: ['N']
            },
            'loop_forever',
            {
                id: 'every_x_seconds',
                defaults: ['INTERVAL']
            },
            {
                id: 'in_x_time',
                defaults: ['DELAY']
            },
            'restart_code'
        ]
    });

    Kano.MakeApps.Blockly.addModule('control', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
