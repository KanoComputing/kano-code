import { localize } from '../../i18n/index.js';

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


// Check Web Audio support
window.AudioContext = window.AudioContext || window.webkitAudioContext;

try {
    synth.ctx = new window.AudioContext();
    synth.webAudioSupported = true;
} catch (e) {
    synth.webAudioSupported = false;
}

// Add synth blocks if supported
if (synth.webAudioSupported) {
    synth.blocks = synth.blocks.concat([{
        block: (part) => {
            return {
                id: 'synth_set_volume',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SPEAKER_VOLUME}`,
                args0: [{
                    type: 'input_value',
                    name: 'VOLUME',
                    check: 'Number'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'VOLUME': `<shadow type="math_number"><field name="NUM">100</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let volume = Blockly.JavaScript.valueToCode(block, 'VOLUME') || 100;

                return `parts.get('${part.id}').setVolume(${volume});\n`;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'synth_play_frequency_for',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_PLAY_FREQUENCY_FOR}`,
                args0: [{
                    type: 'input_value',
                    name: 'FREQUENCY',
                    check: 'Number'
                }, {
                    type: 'input_value',
                    name: 'DURATION',
                    check: 'Number'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'FREQUENCY': `<shadow type="math_number"><field name="NUM">25</field></shadow>`,
                    'DURATION': `<shadow type="math_number"><field name="NUM">100</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let freq = Blockly.JavaScript.valueToCode(block, 'FREQUENCY') || 25,
                    duration = Blockly.JavaScript.valueToCode(block, 'DURATION') || 100;

                return `parts.get('${part.id}').playFrequency(${freq}, ${duration});\n`;
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'synth_start',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_START}`,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `parts.get('${part.id}').startSynth();\n`;
                return code;
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'synth_stop',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_STOP}`,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `parts.get('${part.id}').stop();\n`;
                return code;
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'synth_set_frequency',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_SET_FREQUENCY}`,
                args0: [{
                    type: 'input_value',
                    name: 'FREQUENCY',
                    check: 'Number'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'FREQUENCY': `<shadow type="math_number"><field name="NUM">25</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let freq = Blockly.JavaScript.valueToCode(block, 'FREQUENCY') || 25;
                return `parts.get('${part.id}').setSynthFrequency(${freq});\n`;
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'synth_set_wave',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SYNTH_SET_WAVE}`,
                args0: [{
                    type: 'input_value',
                    name: 'WAVE',
                    check: 'Wave'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let wave = Blockly.JavaScript.valueToCode(block, 'WAVE') || "'sine'";
                return `parts.get('${part.id}').setSynthWave(${wave});\n`;
            };
        }
    }, {
        block: () => {
            return {
                id: 'synth_wave',
                message0: '%1',
                args0: [{
                    type: 'field_dropdown',
                    name: 'WAVE',
                    options: [
                        ['sine', 'sine'],
                        ['square', 'square'],
                        ['triangle', 'triangle'],
                        ['sawtooth', 'sawtooth']
                    ]
                }],
                inputsInline: true,
                output: "Wave"
            };
        },
        javascript: (part) => {
            return (block) => {
                let wave = block.getFieldValue('WAVE'),
                    code = `'${wave}'`;
                return [code];
            };
        }
    }]);
};

export default synth;
