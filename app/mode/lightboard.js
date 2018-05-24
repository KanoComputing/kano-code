import '../elements/kano-editor-lightboard/kano-editor-lightboard.js';
import { Mode } from '../lib/index.js';

const COLOR = '#4674e8';
const definition = {
    id: 'lightboard',
    name: 'Lightboard',
    colour: COLOR,
    parts: ['clock', 'microphone', 'speaker', 'synth', 'light-animation-display',
                'light-animation', 'light-circle', 'light-frame', 'light-rectangle',
                'rss', 'sports', 'weather', 'iss', 'share', 'motion-sensor', 'gyro-accelerometer',
                'oscillator', 'terminal'],
    workspace: {
        viewport: {
            width: 466,
            height: 329
        },
        component: 'kano-workspace-lightboard'
    },
    sharing: {
        cover: 'still',
        spritesheet: true,
        padding: 10,
        color: '#263238'
    },
    defaultSource: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="part_event" id="default_part_event_id" colour="#33a7ff" x="60" y="120"><field name="EVENT">global.start</field></block></xml>',
    events: [{
        label: 'UP pressed',
        id: 'lightboard-js-up',
    }, {
        label: 'DOWN pressed',
        id: 'lightboard-js-down',
    }, {
        label: 'LEFT pressed',
        id: 'lightboard-js-left',
    }, {
        label: 'RIGHT pressed',
        id: 'lightboard-js-right',
    }, {
        label: 'A pressed',
        id: 'lightboard-btn-A',
    }, {
        label: 'B pressed',
        id: 'lightboard-btn-B',
    }],
};

const pixelBlocks = [{
    block: () => {
        return {
            id: 'turn_on',
            message0: 'Lights: turn on %1 set color %2',
            args0: [{
                type: "input_value",
                name: "TARGET",
                check: 'Light'
            },{
                type: "input_value",
                name: "COLOR",
                check: "Colour",
                align: "RIGHT"
            }],
            inputsInline: false,
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part) => {
        return (block) => {
            let target = Blockly.JavaScript.valueToCode(block, 'TARGET') || `{"type":"all"}`,
                color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '"#ffffff"',
                code = `devices.get('${part.id}').turnOn(${target}, ${color});\n`;
            return code;
        };
    }
},{
    block: () => {
        return {
            id: 'turn_off',
            message0: 'Lights: turn off %1',
            inputsInline: false,
            args0: [{
                type: "input_value",
                name: "TARGET",
                check: 'Light'
            }],
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part) => {
        return (block) => {
            let target = Blockly.JavaScript.valueToCode(block, 'TARGET') || '',
                code = `devices.get('${part.id}').turnOff(${target});\n`;
            return code;
        };
    }
},{
    block: () => {
        return {
            id: 'lights_all',
            message0: 'all lights',
            output: 'Light'
        };
    },
    javascript: (part) => {
        return (block) => {
            if (block.parentBlock_) {
                return [JSON.stringify({
                    type: 'all'
                })];
            }
            return;
        };
    },
    pseudo: (part) => {
        return (block) => {
            if (block.parentBlock_) {
                return [JSON.stringify({
                    type: 'all'
                })];
            }
            return;
        };
    }
},{
    block: () => {
        return {
            id: 'light_x_y',
            message0: 'light at x %1 y %2',
            output: 'Light',
            args0: [{
                type: "input_value",
                name: "X",
                check: 'Number'
            },
            {
                type: "input_value",
                name: "Y",
                check: "Number",
                align: "RIGHT"
            }],
            shadow: {
                'X': '<shadow type="math_number"><field name="NUM">1</field></shadow>',
                'Y': '<shadow type="math_number"><field name="NUM">1</field></shadow>'
            }
        };
    },
    javascript: () => {
        return (block) => {
            let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                y = Blockly.JavaScript.valueToCode(block, 'Y') || 0;
            if (block.parentBlock_) {
                return [`{
                    type: 'single',
                    x: ${x}-1,
                    y: ${y}-1
                }`];
            }
            return;
        };
    }
},{
    block: () => {
        return {
            id: 'light_random',
            message0: 'random light',
            output: 'Light',
        };
    },
    javascript: () => {
        return (block) => {
            if (block.parentBlock_) {
                return [`{
                    type: 'single',
                    x: Math.floor(Math.random() * 16),
                    y: Math.floor(Math.random() * 8)
                }`];
            }
            return;
        };
    },
    pseudo: () => {
        return (block) => {
            if (block.parentBlock_) {
                return [`{
                    type: 'single',
                    x: Math.floor(Math.random() * 16),
                    y: Math.floor(Math.random() * 8)
                }`];
            }
            return;
        };
    }
},{
    block: () => {
        return {
            id: 'light_foreach',
            message0: 'Lights: forEach %1',
            args0: [{
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: [
                    ['column', 'column'],
                    ['row', 'row']
                ]
            }],
            message1: `${Blockly.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
            args1: [{
                type: "input_statement",
                name: "DO"
            }],
            inputsInline: false,
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part) => {
        return (block) => {
            let direction = block.getFieldValue('DIRECTION'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO');

            return `devices.get('${part.id}').forEach('${direction}', function () { ${statement} });`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            let direction = block.getFieldValue('DIRECTION'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO');

            return `devices.get('${part.id}').forEach('${direction}', function () { ${statement} });`;
        };
    }
},{
    block: () => {
        return {
            id: 'light_foreach_index',
            message0: '%1',
            args0: [{
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: [
                    ['currentColumn', 'currentColumn'],
                    ['currentRow', 'currentRow']
                ]
            }],
            inputsInline: true,
            output: "Number"
        };
    },
    javascript: (part) => {
        return (block) => {
            let varName = block.getFieldValue('DIRECTION'),
                code = `devices.get('${part.id}').iterator.${varName}`;
            return [code];
        };
    },
    pseudo: (part) => {
        return (block) => {
            let varName = block.getFieldValue('DIRECTION'),
                code = `devices.get('${part.id}').iterator.${varName}`;
            return [code];
        };
    }
}];

const textBlocks = [{
    block: () => {
        return {
            id: 'light_show_text',
            message0: 'Lights: show text %1 color %2 background %3',
            args0: [{
                type: "input_value",
                name: "TEXT"
            },{
                type: "input_value",
                name: "COLOR",
                check: "Colour",
                align: "RIGHT"
            },{
                type: "input_value",
                name: "BACKGROUND_COLOR",
                check: "Colour",
                align: "RIGHT"
            }],
            inputsInline: false,
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow>',
                'BACKGROUND_COLOR': '<shadow type="colour_picker"><field name="COLOUR">#000000</field></shadow>'
            }
        };
    },
    javascript: (part) => {
        return (block) => {
            let text = Blockly.JavaScript.valueToCode(block, 'TEXT') || '""',
                color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '"#ffffff"',
                backgroundColor = Blockly.JavaScript.valueToCode(block, 'BACKGROUND_COLOR') || '"#000000"',
                code = `devices.get('${part.id}').text(${text}, ${color}, ${backgroundColor});\n`;
            return code;
        };
    }
},{
    block: () => {
        return {
            id: 'light_scroll_text',
            message0: 'Lights: scroll text %1 color %2 background %3 % speed %4',
            args0: [{
                type: "input_value",
                name: "TEXT"
            },{
                type: "input_value",
                name: "COLOR",
                check: "Colour",
                align: "RIGHT"
            },{
                type: "input_value",
                name: "BACKGROUND_COLOR",
                check: "Colour",
                align: "RIGHT"
            },{
                type: "input_value",
                name: "SPEED",
                check: "Number",
                align: "RIGHT"
            }],
            inputsInline: false,
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'SPEED': '<shadow type="math_number"><field name="NUM">100</field></shadow>',
                'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow>',
                'BACKGROUND_COLOR': '<shadow type="colour_picker"><field name="COLOUR">#000000</field></shadow>'
            }
        };
    },
    javascript: (part) => {
        return (block) => {
            let text = Blockly.JavaScript.valueToCode(block, 'TEXT') || '""',
                color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '"#ffffff"',
                backgroundColor = Blockly.JavaScript.valueToCode(block, 'BACKGROUND_COLOR') || '"#000000"',
                speed = Blockly.JavaScript.valueToCode(block, 'SPEED') || '50',
                code = `devices.get('${part.id}').scroll(${text}, ${color}, ${backgroundColor}, ${speed});\n`;
            return code;
        };
    }
}];

const categories = [{
    name: 'Lightboard',
    id: 'lightboard',
    blocks: pixelBlocks,
    colour: COLOR,
}, {
    name: 'Text',
    id: 'lightboard_text',
    blocks: textBlocks,
    colour: COLOR,
}];

definition.categories = categories;

Mode.define(definition.id, definition);
