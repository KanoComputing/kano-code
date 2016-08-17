/* globals Blockly */

let light;

export default light = {
    id: 'lightboard',
    name: 'Lightboard',
    colour: '#82C23D',
    excludeParts: ['button', 'box', 'text-input', 'text', 'map', 'image',
                   'scrolling-text', 'picture-list'],
    workspace: {
        viewport: {
            width: 466,
            height: 240
        },
        component: 'kano-workspace-lightboard'
    },
    blocks: [{
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
                let target = Blockly.JavaScript.valueToCode(block, 'TARGET') || '',
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').turnOn(${target}, ${color});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let target = Blockly.Pseudo.valueToCode(block, 'TARGET') || '',
                    color = Blockly.Pseudo.valueToCode(block, 'COLOR') || '""',
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
        },
        pseudo: (part) => {
            return (block) => {
                let target = Blockly.Pseudo.valueToCode(block, 'TARGET') || '',
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
        javascript: () => {
            return () => {
                return [JSON.stringify({
                    type: 'all'
                })];
            };
        },
        pseudo: () => {
            return () => {
                return [JSON.stringify({
                    type: 'all'
                })];
            };
        }
    },{
        block: () => {
            return {
                id: 'light_x_y',
                message0: 'light at %1 %2',
                inputsInline: true,
                output: 'Light',
                args0: [{
                    type: "input_value",
                    name: "X",
                    check: 'Number'
                },
                {
                    type: "input_value",
                    name: "Y",
                    check: "Number"
                }],
                shadow: {
                    'X': '<shadow type="math_number"><field name="NUM">0</field></shadow>',
                    'Y': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: () => {
            return (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    y = Blockly.JavaScript.valueToCode(block, 'Y') || 0;
                return [`{
                    type: 'single',
                    x: ${x},
                    y: ${y}
                }`];
            };
        },
        pseudo: () => {
            return (block) => {
                let x = Blockly.Pseudo.valueToCode(block, 'X') || 0,
                    y = Blockly.Pseudo.valueToCode(block, 'Y') || 0;
                return [`{
                    type: 'single',
                    x: ${x},
                    y: ${y}
                }`];
            };
        }
    },{
        block: () => {
            return {
                id: 'light_show_text',
                message0: 'Lights: show text %1 color %2 background %3',
                args0: [{
                    type: "input_value",
                    name: "TEXT",
                    check: 'String'
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
                    'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#000000</field></shadow>',
                    'BACKGROUND_COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let text = Blockly.JavaScript.valueToCode(block, 'TEXT') || '',
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '"#ffffff"',
                    backgroundColor = Blockly.JavaScript.valueToCode(block, 'BACKGROUND_COLOR') || '"#000000"',
                    code = `devices.get('${part.id}').text(${text}, ${color}, ${backgroundColor});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let text = Blockly.Pseudo.valueToCode(block, 'TEXT') || '',
                    color = Blockly.Pseudo.valueToCode(block, 'COLOR') || '"#ffffff"',
                    backgroundColor = Blockly.Pseudo.valueToCode(block, 'BACKGROUND_COLOR') || '"#000000"',
                    code = `devices.get('${part.id}').text(${text}, ${color}, ${backgroundColor});\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'light_scroll_text',
                message0: 'Lights: scroll text %1 color %2 background %3 speed %4',
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
                    'SPEED': '<shadow type="math_number"><field name="NUM">50</field></shadow>',
                    'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#000000</field></shadow>',
                    'BACKGROUND_COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let text = Blockly.JavaScript.valueToCode(block, 'TEXT') || '',
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '"#ffffff"',
                    backgroundColor = Blockly.JavaScript.valueToCode(block, 'BACKGROUND_COLOR') || '"#000000"',
                    speed = Blockly.JavaScript.valueToCode(block, 'SPEED') || '50',
                    code = `devices.get('${part.id}').scroll(${text}, ${color}, ${backgroundColor}, ${speed});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let text = Blockly.Pseudo.valueToCode(block, 'TEXT') || '',
                    color = Blockly.Pseudo.valueToCode(block, 'COLOR') || '"#ffffff"',
                    backgroundColor = Blockly.Pseudo.valueToCode(block, 'BACKGROUND_COLOR') || '"#000000"',
                    speed = Blockly.Pseudo.valueToCode(block, 'SPEED') || '50',
                    code = `devices.get('${part.id}').scroll(${text}, ${color}, ${backgroundColor}, ${speed});\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'button_down',
                message0: 'when button %1 is pressed',
                inputsInline: true,
                args0: [{
                    type: "field_dropdown",
                    name: "KEY",
                    options: [
                        ['up', 'js-up'],
                        ['down', 'js-down'],
                        ['left', 'js-left'],
                        ['right', 'js-right'],
                        ['A', 'btn-A'],
                        ['B', 'btn-B']
                    ]
                }],
                message1: '%1',
                args1: [{
                    type: 'input_statement',
                    name: 'DO'
                }],
                previousStatement: true,
                nextStatement: true,
            };
        },
        javascript: (part) => {
            return (block) => {
                let key = block.getFieldValue('KEY'),
                    statement = Blockly.JavaScript.statementToCode(block, 'DO');
                return `devices.get('${part.id}').onKeyDown('${key}', function (){\n${statement}\n});\n`;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let key = block.getFieldValue('KEY'),
                    statement = Blockly.JavaScript.statementToCode(block, 'DO');
                return `devices.get('${part.id}').onKeyDown('${key}', function (){\n${statement}\n});\n`;
            };
        }
    }]
};
