import { localize } from '../../../i18n/index.js';
import '../../../../elements/kano-light-shape-configuration/kano-light-shape-configuration.js';

const lightCircle = {
    partType: 'ui',
    type: 'light-circle',
    label: localize('PART_LIGHT_CIRCLE_NAME'),
    image: '/assets/part/pixels-circle.svg',
    colour: '#FFB347',
    component: 'kano-part-light-circle',
    rotationDisabled: true,
    scaleDisabled: true,
    configPanel: 'kano-light-shape-configuration',
    customizable: {
        properties: [{
            key: 'radius',
            type: 'range',
            label: localize('RADIUS'),
            min: 0,
            max: 3
        },{
            key: 'color',
            type: 'color',
            label: localize('COLOR')
        }],
        style: []
    },
    userProperties: {
        radius: 2,
        color: '#ffffff'
    },
    blocks: [{
        block: (part) => {
            return {
                id: 'set_x',
                message0: `${part.name} ${Blockly.Msg.BLOCK_UI_SET_X}`,
                args0: [{
                    type: "input_value",
                    name: "X",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'X': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    code = `devices.get('${part.id}').setX( ${x}-1);\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_y',
                message0: `${part.name} ${Blockly.Msg.BLOCK_UI_SET_Y}`,
                args0: [{
                    type: "input_value",
                    name: "Y",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'Y': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${part.id}').setY(${y}-1);\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_size',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_CIRCLE_SET_RADIUS}`,
                args0: [{
                    type: "input_value",
                    name: "RADIUS",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'RADIUS': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS') || 1,
                    code = `devices.get('${part.id}').setRadius(${radius});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'move_by',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_MOVE_BY}`,
                args0: [{
                    'type': 'field_dropdown',
                    'name': 'direction',
                    'options': [
                        [
                            Blockly.Msg.DIRECTION_UP,
                            'up'
                        ],
                        [
                            Blockly.Msg.DIRECTION_DOWN,
                            'down'
                        ],
                        [
                            Blockly.Msg.DIRECTION_LEFT,
                            'left'
                        ],
                        [
                            Blockly.Msg.DIRECTION_RIGHT,
                            'right'
                        ]
                    ]
                }, {
                    type: 'input_value',
                    name: 'MOVEMENT',
                    check: 'Number'
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'MOVEMENT': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let direction = block.getFieldValue('direction'),
                    movement = Blockly.JavaScript.valueToCode(block, 'MOVEMENT') || 0,
                    x = 0,
                    y = 0, 
                    code;
                switch(direction) {
                    case 'right':
                        x = movement;
                        break;
                    case 'left':
                        x = -movement;
                        break;
                    case 'down':
                        y = movement;
                        break;
                    case 'up':
                        y = -movement;
                        break;
                }
                code = `devices.get('${part.id}').move(${x}, ${y});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_color',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_CIRCLE_SET_COLOR}`,
                args0: [{
                    type: "input_value",
                    name: "COLOR",
                    check: 'Colour'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'COLOR': `<shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '"#ffffff"',
                    code = `devices.get('${part.id}').setColor(${color});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_x',
                message0: `${part.name} X`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getX()+1`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_y',
                message0: `${part.name} Y`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getY()+1`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_radius',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_CIRCLE_RADIUS}`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getRadius()`;
                return [code];
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'get_color',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_CIRCLE_COLOR}`,
                output: 'Colour'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getColor()`;
                return [code];
            };
        },
    }],
};

export default lightCircle;