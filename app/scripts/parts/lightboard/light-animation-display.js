/* globals Blockly */
import animations from './animations.json';

let lightAnimationDisplay;

export default lightAnimationDisplay = {
    partType: 'ui',
    type: 'light-animation-display',
    label: 'Player',
    image: '/assets/part/pixels-animation-play.svg',
    colour: '#FFB347',
    component: 'kano-part-light-animation-display',
    showDefaultConfiguration: false,
    restrict: 'workspace',
    customizable: {
        properties: [{
            key: 'animation',
            type: 'light-animation',
            label: 'Animation',
            options: Object.keys(animations).map(key => {
                return {
                    label: key,
                    value: key
                };
            })
        },{
            key: 'animations',
            type: 'animations',
            label: 'Animations'
        },{
            key: 'speed',
            type: 'range',
            label: 'Speed',
            min: 1,
            max: 30
        }],
        style: []
    },
    userProperties: {
        animation: 'smiley',
        animations,
        speed: 15
    },
    blocks: [{
        block: (part) => {
            return {
                id: 'animation_display_set_animation',
                message0: `${part.name} set animation to %1`,
                args0: [{
                    type: 'field_dropdown',
                    name: 'ANIMATION',
                    options: Object.keys(animations).map(key => [key, key])
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let animation = block.getFieldValue('ANIMATION'),
                    code = `devices.get('${part.id}').setAnimation('${animation}');\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let animation = block.getFieldValue('ANIMATION'),
                    code = `devices.get('${part.id}').setAnimation('${animation}');\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'animation_display_play',
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
                id: 'animation_display_stop',
                message0: `${part.name} stop`,
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').pause();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').pause();\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'animation_display_go_to_frame',
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
                id: 'animation_display_set_speed',
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
