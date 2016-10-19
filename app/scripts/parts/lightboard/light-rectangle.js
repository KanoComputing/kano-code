/* globals Blockly */

let lightRectangle;

export default lightRectangle = {
    partType: 'ui',
    type: 'light-rectangle',
    label: 'Rectangle',
    image: '/assets/part/pixels-rectangle.svg',
    colour: '#FFB347',
    component: 'kano-part-light-rectangle',
    configPanel: 'kano-light-shape-configuration',
    excludeDefaultBlocks: true,
    restrict: 'workspace',
    customizable: {
        properties: [{
            key: 'width',
            type: 'range',
            label: 'Width',
            min: 1,
            max: 16
        },{
            key: 'height',
            type: 'range',
            label: 'Height',
            min: 1,
            max: 8
        },{
            key: 'color',
            type: 'color',
            label: 'Color'
        }],
        style: []
    },
    userProperties: {
        width: 8,
        height: 4,
        color: '#ffffff'
    },
    blocks: [{
        block: (part) => {
            return {
                id: 'set_x',
                message0: `${part.name} set X to %1`,
                args0: [{
                    type: "input_value",
                    name: "X",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'X': '<shadow type="math_number"><field name="NUM">1</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    code = `devices.get('${part.id}').setX(${x}-1);\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let x = Blockly.Pseudo.valueToCode(block, 'X') || 0,
                    code = `devices.get('${part.id}').setX(${x}-1);\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_y',
                message0: `${part.name} set Y to %1`,
                args0: [{
                    type: "input_value",
                    name: "Y",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'Y': '<shadow type="math_number"><field name="NUM">1</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${part.id}').setY(${y}-1);\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let y = Blockly.Pseudo.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${part.id}').setY(${y-1});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_width',
                message0: `${part.name} set width to %1`,
                args0: [{
                    type: "input_value",
                    name: "WIDTH",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'WIDTH': '<shadow type="math_number"><field name="NUM">1</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let width = Blockly.JavaScript.valueToCode(block, 'WIDTH') || 1,
                    code = `devices.get('${part.id}').setWidth(${width});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let width = Blockly.Pseudo.valueToCode(block, 'WIDTH') || 1,
                    code = `devices.get('${part.id}').setWidth(${width});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_height',
                message0: `${part.name} set height to %1`,
                args0: [{
                    type: "input_value",
                    name: "HEIGHT",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'HEIGHT': '<shadow type="math_number"><field name="NUM">1</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let height = Blockly.JavaScript.valueToCode(block, 'HEIGHT') || 1,
                    code = `devices.get('${part.id}').setHeight(${height});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let height = Blockly.Pseudo.valueToCode(block, 'HEIGHT') || 1,
                    code = `devices.get('${part.id}').setHeight(${height});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_color',
                message0: `${part.name} set color to %1`,
                args0: [{
                    type: "input_value",
                    name: "COLOR",
                    check: 'Colour'
                }],

                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '"#ffffff"',
                    code = `devices.get('${part.id}').setColor(${color});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let color = Blockly.Pseudo.valueToCode(block, 'COLOR') || '"#ffffff"',
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
        },
        pseudo: (part) => {
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
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getY()+1`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_width',
                message0: `${part.name} width`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getWidth()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getWidth()`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_height',
                message0: `${part.name} height`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getHeight()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getHeight()`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_color',
                message0: `${part.name} color`,
                output: 'Colour'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getColor()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getColor()`;
                return [code];
            };
        }
    }]
};
