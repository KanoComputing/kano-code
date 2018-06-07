import { localize } from '../../../i18n/index.js';
import '../../../../elements/kano-light-animation-part-editor/kano-light-animation-part-editor.js';

const lightAnimation = {
    partType: 'ui',
    type: 'light-animation',
    label: localize('PART_LIGHT_ANIMATION_NAME'),
    image: '/assets/part/pixels-animation.svg',
    colour: '#FFB347',
    component: 'kano-part-light-animation',
    restrict: 'workspace',
    rotationDisabled: true,
    scaleDisabled: true,
    configPanel: 'kano-light-animation-part-editor',
    fullscreenEdit: true,
    customizable: {
        properties: [{
            key: 'width',
            type: 'range',
            label: localize('WIDTH'),
        }, {
            key: 'height',
            type: 'range',
            label: localize('HEIGHT'),
        }, {
            key: 'speed',
            type: 'range',
            label: localize('SPEED'),
            min: 1,
            max: 30,
        }, {
            key: 'bitmaps',
            type: 'bitmap-animation',
            label: localize('BITMAPS'),
        }],
        style: [],
    },
    userProperties: {
        width: 16,
        height: 8,
        speed: 15,
        bitmaps: [Array(...Array(128)).map(String.prototype.valueOf, '#000000')],
    },
    blocks: [{
        block: (part) => ({
                id: 'animation_play',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_PLAY}`,
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').play();\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'animation_play_once',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_PLAY_ONCE}`,
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').playOnce();\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'animation_stop',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_STOP}`,
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').pause();\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'animation_go_to_frame',
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
                    'FRAME': `<shadow type="math_number"><field name="NUM">1</field></shadow>`
                }
            }),
        javascript: (part) => (block) => {
                let frame = Blockly.JavaScript.valueToCode(block, 'FRAME') || 1,
                    code = `devices.get('${part.id}').goToFrame(${frame});\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'animation_set_speed',
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
            }),
        javascript: (part) => (block) => {
                let speed = Blockly.JavaScript.valueToCode(block, 'SPEED') || 15,
                    code = `devices.get('${part.id}').setSpeed(${speed});\n`;
                return code;
            },
    }, {
        block: (part) => ({
                id: 'frame_count',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_FRAME_COUNT}`,
                output: 'Number'
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').getFrameCount()`;
                return [code];
            },
    }, {
        block: (part) => ({
                id: 'current_frame',
                message0: `${part.name} ${Blockly.Msg.BLOCK_LIGHT_ANIMATION_CURRENT_FRAME}`,
                output: 'Number'
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').getCurrentFrame()`;
                return [code];
            },
    }],
};

export default lightAnimation;
