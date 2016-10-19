/* globals Blockly */
let lightAnimation;

export default lightAnimation = {
    partType: 'ui',
    type: 'light-animation',
    label: 'Animation',
    image: '/assets/part/pixels-animation.svg',
    colour: '#FFB347',
    component: 'kano-part-light-animation',
    restrict: 'workspace',
    configPanel: 'kano-light-animation-editor',
    customizable: {
        properties: [{
            key: 'width',
            type: 'range',
            label: 'Width'
        },{
            key: 'height',
            type: 'range',
            label: 'Height'
        },{
            key: 'speed',
            type: 'range',
            label: 'Speed',
            min: 1,
            max: 30
        },{
            key: 'bitmaps',
            type: 'bitmap-animation',
            label: 'Bitmaps'
        }],
        style: []
    },
    userProperties: {
        width: 5,
        height: 5,
        speed: 15,
        bitmaps: [['#000000']]
    },
    blocks: [{
        block: (part) => {
            return {
                id: 'animation_play',
                message0: `${part.name} play`,
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').play();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').play();\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'animation_stop',
                message0: `${part.name} stop`,
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').stop();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').stop();\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'animation_go_to_frame',
                message0: `${part.name} go to frame nº %1`,
                args0: [{
                    type: 'input_value',
                    name: 'FRAME',
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'FRAME': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let frame = Blockly.JavaScript.valueToCode(block, 'FRAME') || 0,
                    code = `devices.get('${part.id}').goToFrame(${frame});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let frame = Blockly.Pseudo.valueToCode(block, 'FRAME') || 0,
                    code = `devices.get('${part.id}').goToFrame(${frame});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'animation_set_speed',
                message0: `${part.name} set speed to %1`,
                args0: [{
                    type: 'input_value',
                    name: 'SPEED',
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'SPEED': '<shadow type="math_number"><field name="NUM">15</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let speed = Blockly.JavaScript.valueToCode(block, 'SPEED') || 15,
                    code = `devices.get('${part.id}').setSpeed(${speed});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let speed = Blockly.JavaScript.valueToCode(block, 'SPEED') || 15,
                    code = `devices.get('${part.id}').setSpeed(${speed});\n`;
                return code;
            };
        }
    }]
};
