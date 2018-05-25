import animations from './animations.js';
import { localize } from '../../../i18n/index.js';

const lightAnimationDisplay = {
    partType: 'ui',
    type: 'light-animation-display',
    label: localize('PART_LIGHT_ANIMATION_DISPLAY_NAME'),
    image: '/assets/part/pixels-animation-play.svg',
    colour: '#FFB347',
    component: 'kano-part-light-animation-display',
    showDefaultConfiguration: false,
    restrict: 'workspace',
    customizable: {
        properties: [{
            key: 'animation',
            type: 'list',
            label: localize('ANIMATION'),
            options: Object.keys(animations).map(key => {
                return {
                    label: key,
                    value: key
                };
            })
        },{
            key: 'speed',
            type: 'range',
            label: localize('SPEED'),
            min: 1,
            max: 30
        }],
        style: []
    },
    userProperties: {
        animation: 'Smiley',
        animations: animations,
        speed: 15
    },
    blocks: [{
        block: (part) => {
            return {
                id: 'animation_display_set_animation',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_DISPLAY_SET_ANIMATION}`,
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
        }
    },{
        block: (part) => {
            return {
                id: 'animation_display_play',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_PLAY}`,
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
        }
    },{
        block: (part) => {
            return {
                id: 'animation_display_stop',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_STOP}`,
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
        }
    },{
        block: (part) => {
            return {
                id: 'animation_display_go_to_frame',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_GO_TO_FRAME}`,
                args0: [{
                    type: 'input_value',
                    name: 'FRAME',
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'FRAME': `<shadow type="math_number"><field name="NUM">0</field></shadow>`
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
    }, {
        block: (part) => {
            return {
                id: 'animation_display_set_speed',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_SET_SPEED}`,
                args0: [{
                    type: 'input_value',
                    name: 'SPEED',
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'SPEED': `<shadow type="math_number"><field name="NUM">15</field></shadow>`
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
    }],
};

export default lightAnimationDisplay;
