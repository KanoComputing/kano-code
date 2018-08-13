import { localize } from '../../../i18n/index.js';
import '../../../../elements/kano-light-shape-configuration/kano-light-shape-configuration.js';

const lightRectangle = {
    partType: 'ui',
    type: 'light-rectangle',
    label: localize('PART_LIGHT_RECTANGLE_NAME'),
    image: '/assets/part/pixels-rectangle.svg',
    colour: '#FFB347',
    component: 'kano-part-light-rectangle',
    configPanel: 'kano-light-shape-configuration',
    rotationDisabled: true,
    scaleDisabled: true,
    restrict: 'workspace',
    customizable: {
        properties: [{
            key: 'width',
            type: 'range',
            label: localize('WIDTH'),
            min: 1,
            max: 16,
        }, {
            key: 'height',
            type: 'range',
            label: localize('HEIGHT'),
            min: 1,
            max: 8,
        }, {
            key: 'color',
            type: 'color',
            label: localize('COLOR'),
        }],
        style: [],
    },
    userProperties: {
        width: 8,
        height: 4,
        color: '#ffffff',
    },
    blocks: [{
        block: (part) => ({
                id: 'set_x',
                message0: `${part.name} ${Blockly.Msg.BLOCK_UI_SET_X}`,
                args0: [{
                    type: "input_value",
                    name: "X",
                    check: 'Number',
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'X': `<shadow type="math_number"><field name="NUM">1</field></shadow>`,
                },
            }),
        javascript: (part) => (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    code = `devices.get('${part.id}').setX(${x}-1);\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'set_y',
                message0: `${part.name} ${Blockly.Msg.BLOCK_UI_SET_Y}`,
                args0: [{
                    type: "input_value",
                    name: "Y",
                    check: 'Number',
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'Y': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
                }
            }),
        javascript: (part) => (block) => {
                let y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${part.id}').setY(${y}-1);\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'set_width',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_RECTANGLE_SET_WIDTH}`,
                args0: [{
                    type: "input_value",
                    name: "WIDTH",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'WIDTH': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
                }
            }),
        javascript: (part) => (block) => {
                let width = Blockly.JavaScript.valueToCode(block, 'WIDTH') || 1,
                    code = `devices.get('${part.id}').setWidth(${width});\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'set_height',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_RECTANGLE_SET_HEIGHT}`,
                args0: [{
                    type: "input_value",
                    name: "HEIGHT",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'HEIGHT': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
                }
            }),
        javascript: (part) => (block) => {
                let height = Blockly.JavaScript.valueToCode(block, 'HEIGHT') || 1,
                    code = `devices.get('${part.id}').setHeight(${height});\n`;
                return code;
            },
    }, {
        block: (part) => ({
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
            }),
        javascript: (part) => (block) => {
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
            },
    }, {
        block: (part) => ({
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
            }),
        javascript: (part) => (block) => {
                let color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '"#ffffff"',
                    code = `devices.get('${part.id}').setColor(${color});\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'get_x',
                message0: `${part.name} X`,
                output: 'Number'
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').getX()+1`;
                return [code];
            },
    }, {
        block: (part) => ({
                id: 'get_y',
                message0: `${part.name} Y`,
                output: 'Number'
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').getY()+1`;
                return [code];
            },
    }, {
        block: (part) => ({
                id: 'get_width',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_RECTANGLE_WIDTH}`,
                output: 'Number'
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').getWidth()`;
                return [code];
            },
    }, {
        block: (part) => ({
                id: 'get_height',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_RECTANGLE_HEIGHT}`,
                output: 'Number'
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').getHeight()`;
                return [code];
            },
    }, {
        block: (part) => ({
                id: 'get_color',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_CIRCLE_COLOR}`,
                output: 'Colour'
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').getColor()`;
                return [code];
            },
    }],
};

export default lightRectangle;
