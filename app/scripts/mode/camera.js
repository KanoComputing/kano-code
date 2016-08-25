import backgroundBlocks from './common/background-blocks';

let Camera;

export default Camera = {
    id: 'camera',
    name: 'Camera',
    allowBackground: true,
    workspace: {
        viewport: {
            width: 512,
            height: 384
        },
        component: 'kano-workspace-camera'
    },
    colour: '#82C23D',
    parts: ['clock', 'microphone', 'speaker', 'kaleidoscope',
                'button', 'box', 'image', 'map', 'picture-list',
                'scrolling-text', 'slider', 'text-input', 'text',
                'rss', 'sports', 'weather', 'iss', 'share', 'canvas',
                'proximity-sensor'],
    events: [{
        label: 'takes picture',
        id: 'picture-taken'
    }],
    blocks: [{
        block: () => {
            return {
                id: 'take_picture',
                message0: 'Camera: take picture',
                args0: [],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getCamera().takePicture();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getCamera().takePicture();\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'last_picture',
                message0: 'Camera: last picture taken',
                args0: [],
                inputsInline: true,
                output: 'String'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getCamera().lastPicture()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getCamera().lastPicture()`;
                return [code];
            };
        }
    }, {
        block: () => {
            return {
                id: 'ledring_flash',
                message0: 'Led ring: flash color %1 duration %2',
                args0: [{
                    type: "input_value",
                    name: "COLOR",
                    check: 'Colour'
                },{
                    type: "input_value",
                    name: "LENGTH",
                    check: "Number",
                    align: "RIGHT"
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'LENGTH': '<shadow type="math_number"><field name="NUM">200</field></shadow>',
                    'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let length = Blockly.JavaScript.valueToCode(block, 'LENGTH') || 200,
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').flash(${color}, ${length});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let length = Blockly.JavaScript.valueToCode(block, 'LENGTH') || 200,
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').flash(${color}, ${length});\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'timer_turned',
                message0: 'when shutter turns %1',
                inputsInline: true,
                args0: [{
                    type: "field_dropdown",
                    name: "DIRECTION",
                    options: [
                        ['left', 'cw'],
                        ['right', 'ccw']
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
                let direction = block.getFieldValue('DIRECTION'),
                    statement = Blockly.JavaScript.statementToCode(block, 'DO');
                return `devices.get('${part.id}').onShutterTurns('${direction}', function (){\n${statement}\n});\n`;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let direction = block.getFieldValue('DIRECTION'),
                    statement = Blockly.JavaScript.statementToCode(block, 'DO');
                return `devices.get('${part.id}').onShutterTurns('${direction}', function (){\n${statement}\n});\n`;
            };
        }
    },{
        block: () => {
            return {
                id: 'shutter_down',
                message0: 'when shutter is pushed',
                inputsInline: true,
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
                let statement = Blockly.JavaScript.statementToCode(block, 'DO');
                return `devices.get('${part.id}').onShutterDown(function (){\n${statement}\n});\n`;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let statement = Blockly.JavaScript.statementToCode(block, 'DO');
                return `devices.get('${part.id}').onShutterDown(function (){\n${statement}\n});\n`;
            };
        }
    }].concat(backgroundBlocks)
};
