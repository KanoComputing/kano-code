import { localize } from '../../../i18n/index.js';
import { AudioPlayer } from '../../../../scripts/kano/music/player.js';
import './kano-part-synth.js';

const COLOUR = '#C93E6A';

const synth = {
    partType: 'hardware',
    type: 'synth',
    label: localize('PART_SYNTH_NAME'),
    image: '/assets/part/osc.svg',
    colour: COLOUR,
    component: 'kano-part-synth',
    experiments: {},
    blocks: [],
};

synth.webAudioSupported = AudioPlayer.webAudioSupported;
synth.ctx = AudioPlayer.context;

// Add synth blocks if supported
if (synth.webAudioSupported) {
    synth.blocks = synth.blocks.concat([{
        block: part => ({
            id: 'synth_set_volume',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_SPEAKER_VOLUME}`,
            args0: [{
                type: 'input_value',
                name: 'VOLUME',
                check: 'Number',
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                VOLUME: '<shadow type="math_number"><field name="NUM">100</field></shadow>',
            },
        }),
        javascript: part => (block) => {
            const volume = Blockly.JavaScript.valueToCode(block, 'VOLUME') || 100;

            return `parts.get('${part.id}').setVolume(${volume});\n`;
        },
    }, {
        block: part => ({
            id: 'synth_play_frequency_for',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_PLAY_FREQUENCY_FOR}`,
            args0: [{
                type: 'input_value',
                name: 'FREQUENCY',
                check: 'Number',
            }, {
                type: 'input_value',
                name: 'DURATION',
                check: 'Number',
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                FREQUENCY: '<shadow type="math_number"><field name="NUM">25</field></shadow>',
                DURATION: '<shadow type="math_number"><field name="NUM">100</field></shadow>',
            },
        }),
        javascript: part => (block) => {
            const freq = Blockly.JavaScript.valueToCode(block, 'FREQUENCY') || 25;
            const duration = Blockly.JavaScript.valueToCode(block, 'DURATION') || 100;

            return `parts.get('${part.id}').playFrequency(${freq}, ${duration});\n`;
        },
    }, {
        block: part => ({
            id: 'synth_start',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_START}`,
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: part => (block) => {
            const code = `parts.get('${part.id}').startSynth();\n`;
            return code;
        },
    }, {
        block: part => ({
            id: 'synth_stop',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_STOP}`,
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: part => (block) => {
            const code = `parts.get('${part.id}').stop();\n`;
            return code;
        },
    }, {
        block: part => ({
            id: 'synth_set_frequency',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_SET_FREQUENCY}`,
            args0: [{
                type: 'input_value',
                name: 'FREQUENCY',
                check: 'Number',
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                FREQUENCY: '<shadow type="math_number"><field name="NUM">25</field></shadow>',
            },
        }),
        javascript: part => (block) => {
            const freq = Blockly.JavaScript.valueToCode(block, 'FREQUENCY') || 25;
            return `parts.get('${part.id}').setSynthFrequency(${freq});\n`;
        },
    }, {
        block: part => ({
            id: 'synth_set_wave',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_SET_WAVE}`,
            args0: [{
                type: 'input_value',
                name: 'WAVE',
                check: 'Wave',
            }],
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: part => (block) => {
            const wave = Blockly.JavaScript.valueToCode(block, 'WAVE') || "'sine'";
            return `parts.get('${part.id}').setSynthWave(${wave});\n`;
        },
    }, {
        block: () => ({
            id: 'synth_wave',
            message0: '%1',
            args0: [{
                type: 'field_dropdown',
                name: 'WAVE',
                options: [
                    ['sine', 'sine'],
                    ['square', 'square'],
                    ['triangle', 'triangle'],
                    ['sawtooth', 'sawtooth'],
                ],
            }],
            inputsInline: true,
            output: 'Wave',
        }),
        javascript: part => (block) => {
            const wave = block.getFieldValue('WAVE');
            const code = `'${wave}'`;
            return [code];
        },
    }]);
}

export default synth;
