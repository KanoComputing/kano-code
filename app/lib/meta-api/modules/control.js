const COLOR = '#1198ff';

class BlocklyControl {
    static get type() { return 'blockly'; }
    static get id() { return 'control'; }
    static register(Blockly) {
        Blockly.Blocks.loop_forever = {
            init() {
                const json = {
                    id: 'loop_forever',
                    colour: COLOR,
                    message0: `${Blockly.Msg.LOOP_FOREVER_REPEAT} %1 %2`,
                    args0: [
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'input_statement',
                            name: 'DO',
                        }],
                    message1: Blockly.Msg.LOOP_FOREVER_FOREVER,
                    previousStatement: null,
                    nextStatement: null,
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.loop_forever = (block) => {
            const statement = Blockly.JavaScript.statementToCode(block, 'DO');
            return `loop.forever(function () {\n${statement}});\n`;
        };


        Blockly.Blocks.every_x_seconds = {
            init() {
                const json = {
                    id: 'every_x_seconds',
                    colour: COLOR,
                    message0: `${Blockly.Msg.LOOP_EVERY_REPEAT} %1 %2`,
                    args0: [{
                        type: 'input_value',
                        name: 'INTERVAL',
                    }, {
                        type: 'field_dropdown',
                        name: 'UNIT',
                        options: [
                            [
                                'seconds',
                                'seconds',
                            ],
                            [
                                'milliseconds',
                                'milliseconds',
                            ],
                            [
                                'frames',
                                'frames',
                            ],
                        ],
                    }],
                    message1: `${Blockly.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
                    args1: [{
                        type: 'input_statement',
                        name: 'DO',
                    }],
                    previousStatement: null,
                    nextStatement: null,
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.every_x_seconds = (block) => {
            const statement = Blockly.JavaScript.statementToCode(block, 'DO');
            const interval = Blockly.JavaScript.valueToCode(block, 'INTERVAL') || 5;
            const unit = block.getFieldValue('UNIT') || 'seconds';
            return `time.every(${interval}, '${unit}', function () {\n${statement}});\n`;
        };

        Blockly.Blocks.in_x_time = {
            init() {
                const json = {
                    id: 'in_x_time',
                    colour: COLOR,
                    message0: Blockly.Msg.LOOP_IN,
                    args0: [{
                        type: 'input_value',
                        name: 'DELAY',
                    }, {
                        type: 'field_dropdown',
                        name: 'UNIT',
                        options: [
                            [
                                'seconds',
                                'seconds',
                            ],
                            [
                                'milliseconds',
                                'milliseconds',
                            ],
                        ],
                    }],
                    message1: `${Blockly.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
                    args1: [{
                        type: 'input_statement',
                        name: 'DO',
                    }],
                    previousStatement: null,
                    nextStatement: null,
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.in_x_time = (block) => {
            const statement = Blockly.JavaScript.statementToCode(block, 'DO');
            const delay = Blockly.JavaScript.valueToCode(block, 'DELAY') || 1;
            const unit = block.getFieldValue('UNIT') || 'seconds';
            return `time.later(${delay}, '${unit}', function () {\n${statement}});\n`;
        };

        Blockly.Blocks.repeat_x_times = {
            init() {
                const json = {
                    id: 'repeat_x_times',
                    colour: COLOR,
                    message0: Blockly.Msg.LOOP_X_TIMES_REPEAT,
                    args0: [{
                        type: 'input_value',
                        name: 'N',
                    }],
                    message1: '%1',
                    args1: [{
                        type: 'input_statement',
                        name: 'DO',
                    }],
                    previousStatement: null,
                    nextStatement: null,
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.repeat_x_times = (block) => {
            const n = Blockly.JavaScript.valueToCode(block, 'N') || 2;
            let branch = Blockly.JavaScript.statementToCode(block, 'DO');
            const loopVar = Blockly.JavaScript.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
            branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
            return `for (var ${loopVar} = 0; ${loopVar} < ${n}; ${loopVar}++) {\n${branch}}\n`;
        };

        Blockly.Blocks.restart_code = {
            init() {
                const json = {
                    id: 'restart_code',
                    colour: COLOR,
                    message0: Blockly.Msg.RESTART_CODE,
                    previousStatement: null,
                    nextStatement: null,
                };
                this.jsonInit(json);
            },
        };

        Blockly.JavaScript.restart_code = () => 'global.restartCode();';
    }
    static get category() {
        return {
            name: Blockly.Msg.CATEGORY_CONTROL,
            id: BlocklyControl.id,
            colour: COLOR,
            blocks: [
                {
                    id: 'repeat_x_times',
                    defaults: ['N'],
                },
                'loop_forever',
                {
                    id: 'every_x_seconds',
                    defaults: ['INTERVAL'],
                },
                {
                    id: 'in_x_time',
                    defaults: ['DELAY'],
                },
                'restart_code',
            ],
        };
    }
    static get defaults() {
        return {
            every_x_seconds: {
                INTERVAL: 1,
                UNIT: 'seconds',
            },
            in_x_time: {
                DELAY: 1,
                UNIT: 'seconds',
            },
            repeat_x_times: {
                N: 10,
            },
        };
    }
}

export default BlocklyControl;
