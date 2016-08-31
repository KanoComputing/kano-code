/* globals Blockly */

let speaker;

const samples = {
    instruments: {
        'joke_drum': 'Joke Drum',
        'bass_hit_c': 'Bass Hit',
        'bass_voxy_hit_c': 'Bass Voxy Hit',
        'bd_ada': 'Drum Beat',
        'drum_bass_hard': 'Drum Bass Hard',
        'drum_cymbal_hard': 'Drum Cymbal Hard',
        'drum_roll': 'Drum Roll',
        'ambi_piano': 'Ambi Piano'
    },
    loops: {
        'loop_safari': 'Safari',
        'loop_compus': 'Compus',
        'loop_mika': 'Mika',
        'loop_amen_full': 'Amen',
        'apache': 'Apache',
        'bass_loop': 'Bass'
    },
    sounds: {
        'short_fart': 'Fart',
        'vinyl_backspin': 'Vinyl',
        'perc_snap': 'Snap',
        'misc_crow': 'Crow',
        'elec_twip': 'Twip',
        'elec_ping': 'Ping',
        'misc_burp': 'Burp',
        'perc_bell': 'Bell',
        'perc_swash': 'Swash',
    },
    kano: {
        'ungrab': 'Ungrab',
        'make': 'Make',
        'grab': 'Grab',
        'error2': 'Error',
        'error_v2': 'Error 2',
        'error': 'Error 3',
        'challenge_complete': 'Challenge Complete',
        'boot_up_v2': 'Boot Up',
        'boot_up': 'Boot Up 2',
    }
};
const COLOUR = '#FFB347';

speaker = {
    partType: 'hardware',
    type: 'speaker',
    label: 'Speaker',
    image: '/assets/part/speaker.svg',
    colour: COLOUR,
    component: 'kano-part-speaker',
    experiments: {
        'sound': []
    },
    blocks: [{
        block: () => {
            return {
                id: 'say',
                message0: 'Speaker: say Text %1 Speed %2 Accent %3',
                inputsInline: false,
                args0: [{
                    type: "input_value",
                    name: "TEXT"
                },
                {
                    type: "input_value",
                    name: "RATE",
                    check: "Number"
                },
                {
                    type: "field_dropdown",
                    name: "LANGUAGE",
                    options: [
                        [
                            "British English",
                            "en-GB"
                        ],
                        [
                            "US English",
                            "en-US"
                        ],
                        [
                            "French",
                            "fr-FR"
                        ],
                        [
                            "German",
                            "de-DE"
                        ],
                        [
                            "Italian",
                            "it-IT"
                        ]
                    ]
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let text = Blockly.JavaScript.valueToCode(block, 'TEXT') || '""',
                    rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 1,
                    lang = block.getFieldValue('LANGUAGE'),
                    code = `parts.get('${part.id}').say(${text}, ${rate}, "${lang}");\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let text = Blockly.Pseudo.valueToCode(block, 'TEXT') || `''`,
                    rate = Blockly.Pseudo.valueToCode(block, 'RATE') || 1,
                    lang = block.getFieldValue('LANGUAGE'),
                    code = `parts.get('${part.id}').say(${text}, ${rate}, "${lang}");\n`;
                return code;
            };
        }
    }]
};


// Check Web Audio support
window.AudioContext = window.AudioContext || window.webkitAudioContext;

try {
    speaker.ctx = new window.AudioContext();
    speaker.webAudioSupported = true;
} catch (e) {
    speaker.webAudioSupported = false;
}

// Add speaker blocks if supported
if (speaker.webAudioSupported) {
    speaker.experiments.sound = [{
        block: () => {
            return {
                id: 'speaker_play',
                message0: 'Speaker: play %1',
                args0: [{
                    type: "input_value",
                    name: "SAMPLE",
                    check: 'Sample'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let sample = Blockly.JavaScript.valueToCode(block, 'SAMPLE') || 'null',
                    code = `parts.get('${part.id}').play(${sample});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let sample = Blockly.Pseudo.valueToCode(block, 'SAMPLE') || 'null',
                    code = `parts.get('${part.id}').play(${sample});\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'speaker_loop',
                message0: 'Speaker: loop %1',
                args0: [{
                    type: "input_value",
                    name: "SAMPLE",
                    check: 'Sample'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let sample = Blockly.JavaScript.valueToCode(block, 'SAMPLE') || 'null',
                    code = `parts.get('${part.id}').loop(${sample});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let sample = Blockly.Pseudo.valueToCode(block, 'SAMPLE') || 'null',
                    code = `parts.get('${part.id}').loop(${sample});\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'speaker_stop',
                message0: 'Speaker: stop',
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `parts.get('${part.id}').stop();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `parts.get('${part.id}').stop();\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            let sampleSet = Object.keys(samples),
                id = 'speaker_sample';
            Blockly.Blocks[`${part.id}#${id}`] = {
                init: function () {

                    let setDropdown = new Blockly.FieldDropdown(sampleSet.map(name => [name, name]), function (option) {
                        this.sourceBlock_.updateShape_(option);
                    });

                    this.setColour(part.colour);

                    this.appendDummyInput()
                        .appendField(setDropdown, 'SET');

                    this.setOutput('Sample');

                    this.setInputsInline(true);

                    this.createInputs_('kano');
                },
                updateShape_: function (option) {
                    this.removeInput('SAMPLE');
                    this.createInputs_(option);
                },
                createInputs_: function (option) {
                    let options = Object.keys(samples[option]).map(key => [samples[option][key], key]),
                        dropdown = new Blockly.FieldDropdown(options);
                    this.appendDummyInput('SAMPLE')
                        .appendField(dropdown, 'SAMPLE');
                },
                domToMutation: function (xmlElement) {
                    let type = xmlElement.getAttribute('set');
                    this.updateShape_(type);
                },
                mutationToDom: function () {
                    let container = document.createElement('mutation'),
                        type = this.getFieldValue('SET');
                    container.setAttribute('set', type);
                    return container;
                }
            };
            return {
                id,
                colour: COLOUR,
                doNotRegister: true
            };
        },
        javascript: () => {
            return (block) => {
                let sample = block.getFieldValue('SAMPLE') || 'amen';
                return [`'${sample}'`];
            };
        },
        pseudo: () => {
            return (block) => {
                let sample = block.getFieldValue('SAMPLE') || 'amen';
                return [`'${sample}'`];
            };
        }
    }];
}


export default speaker;
