import { localize } from '../../../i18n/index.js';
import './kano-part-oscillator.js';

const oscillator = {
    partType: 'ui',
    type: 'oscillator',
    label: localize('PART_OSC_NAME'),
    component: 'kano-part-oscillator',
    image: '/assets/part/osc.svg',
    colour: '#FFB347',
    customizable: {
        properties: [{
            key: 'wave',
            label: localize('WAVE'),
            type: 'list',
            options: [{
                value: 'sine',
                label: 'Sine',
                image: '/assets/part/oscillator/sine.svg',
            }, {
                value: 'square',
                label: 'Square',
                image: '/assets/part/oscillator/square.svg',
            }, {
                value: 'sawtooth',
                label: 'Sawtooth',
                image: '/assets/part/oscillator/sawtooth.svg',
            }, {
                value: 'triangle',
                label: 'Triangle',
                image: '/assets/part/oscillator/triangle.svg',
            }],
        }, {
            key: 'speed',
            label: localize('SPEED'),
            type: 'range',
            min: 0,
            max: 100,
        }, {
            key: 'delay',
            label: localize('DELAY'),
            type: 'range',
            min: 0,
            max: 100,
        }],
        style: [],
    },
    userProperties: {
        wave: 'sine',
        speed: 50,
        delay: 0,
    },
    showDefaultConfiguration: false,
    excludeDefaultBlocks: true,
    blocks: [{
        block: (part) => ({
                id: 'osc_get_value',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_VALUE}`,
                output: 'Number'
            }),
        javascript: (part) => (block) => {
                let code = `devices.get('${part.id}').getValue()`;
                return [code];
            },
    }, {
        block: (part) => ({
                id: 'osc_set_speed',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_OSC_SET_SPEED}`,
                args0: [{
                    type: 'input_value',
                    name: 'SPEED',
                    check: 'Number'
                }],
                previousStatement: true,
                nextStatement: true
            }),
        javascript: (part) => (block) => {
                let speed = Blockly.JavaScript.valueToCode(block, 'SPEED') || 50;
                return `devices.get('${part.id}').setSpeed(${speed});\n`;
            },
    }, {
        block: (part) => ({
                id: 'osc_get_speed',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_OSC_SPEED}`,
                output: 'Number'
            }),
        javascript: (part) => () => {
                return [`devices.get('${part.id}').getSpeed()`];
            },
    }, {
        block: (part) => ({
                id: 'osc_set_delay',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_OSC_SET_DELAY}`,
                args0: [{
                    type: 'input_value',
                    name: 'DELAY',
                    check: 'Number'
                }],
                previousStatement: true,
                nextStatement: true
            }),
        javascript: (part) => (block) => {
                let delay = Blockly.JavaScript.valueToCode(block, 'DELAY') || 0;
                return `devices.get('${part.id}').setDelay(${delay});\n`;
            },
    }, {
        block: (part) => ({
                id: 'osc_get_delay',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_OSC_DELAY}`,
                output: 'Number'
            }),
        javascript: (part) => () => {
                return [`devices.get('${part.id}').getDelay()`];
            },
    }],
};

export default oscillator;
