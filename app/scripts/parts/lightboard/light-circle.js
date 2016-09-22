/* globals Blockly */

let lightCircle;

export default lightCircle = {
    partType: 'ui',
    type: 'light-circle',
    label: 'Circle',
    image: '/assets/part/pixels-circle.svg',
    colour: '#FFB347',
    component: 'kano-part-light-circle',
    excludeDefaultBlocks: true,
    restrict: 'workspace',
    customizable: {
        properties: [{
            key: 'radius',
            type: 'range',
            label: 'Radius',
            min: 0,
            max: 3
        },{
            key: 'color',
            type: 'color',
            label: 'Color'
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
                    'X': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    code = `devices.get('${part.id}').setX( ${x});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let x = Blockly.Pseudo.valueToCode(block, 'X') || 0,
                    code = `devices.get('${part.id}').setX( ${x});\n`;
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
                    'Y': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${part.id}').setY(${y});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let y = Blockly.Pseudo.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${part.id}').setY(${y});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_size',
                message0: `${part.name} set radius to %1`,
                args0: [{
                    type: "input_value",
                    name: "RADIUS",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'RADIUS': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS') || 1,
                    code = `devices.get('${part.id}').setRadius(${radius});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let radius = Blockly.Pseudo.valueToCode(block, 'RADIUS') || 1,
                    code = `devices.get('${part.id}').setRadius(${radius});\n`;
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
                nextStatement: null,
                shadow: {
                    'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow>'
                }
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
                let code = `devices.get('${part.id}').getX()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getX()`;
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
                let code = `devices.get('${part.id}').getY()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getY()`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_radius',
                message0: `${part.name} radius`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getRadius()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getRadius()`;
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
