import { localize } from '../../../i18n/index.js';
import { AudioPlayer } from '../../../../scripts/kano/music/player.js';
import { FieldSoundsFactory } from './custom-blockly/sounds-field.js';
import './kano-part-speaker.js';

export const SpeakerFactory = (appRoot, samples, samplesDir, defaultCategory) => {
    const COLOUR = '#FFB347';

    const root = `${appRoot}/assets/audio/samples/`;

    const defaultSet = samples[defaultCategory];
    const defaultValue = Object.keys(defaultSet)[0];
    const defaultLabel = defaultSet[defaultValue];

    const speaker = {
        partType: 'hardware',
        type: 'speaker',
        label: localize('PART_SPEAKER_NAME'),
        image: '/assets/part/speaker.svg',
        colour: COLOUR,
        component: 'kano-part-speaker',
        config: {
            assetsRoot: root,
            samples,
        },
        defaults: {
            speaker_sample: {
                SET: defaultCategory,
                SAMPLE: {
                    id: defaultValue,
                    label: defaultLabel,
                },
            },
            say: {
                TEXT: 'empty',
                RATE: 100,
                LANGUAGE: {
                    id: 'en-GB',
                    label: 'British English',
                },
            },
            random_from_set: {
                SET: 'any',
            },
            speaker_playback_rate: {
                RATE: 100,
            },
            speaker_set_volume: {
                VOLUME: 100,
            },
        },
        blocks: [{
            block: part => ({
                id: 'say',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SPEAKER_SAY}`,
                inputsInline: false,
                args0: [{
                    type: 'input_value',
                    name: 'TEXT',
                    align: 'RIGHT',
                },
                {
                    type: 'input_value',
                    name: 'RATE',
                    check: 'Number',
                    align: 'RIGHT',
                },
                {
                    type: 'field_dropdown',
                    name: 'LANGUAGE',
                    options: [
                        [
                            Blockly.Msg.BLOCK_SPEAKER_BRITISH,
                            'en-GB',
                        ],
                        [
                            Blockly.Msg.BLOCK_SPEAKER_US,
                            'en-US',
                        ],
                        [
                            Blockly.Msg.BLOCK_SPEAKER_FRENCH,
                            'fr-FR',
                        ],
                        [
                            Blockly.Msg.BLOCK_SPEAKER_GERMAN,
                            'de-DE',
                        ],
                        [
                            Blockly.Msg.BLOCK_SPEAKER_ITALIAN,
                            'it-IT',
                        ],
                    ],
                    align: 'RIGHT',
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    TEXT: '<shadow type="text"><field name="TEXT"></field></shadow>',
                    RATE: '<shadow type="math_number"><field name="NUM">100</field></shadow>',
                },
            }),
            javascript: part => (block) => {
                let text = Blockly.JavaScript.valueToCode(block, 'TEXT') || '""',
                    rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 100,
                    adjustedRate = rate / 100,
                    lang = block.getFieldValue('LANGUAGE'),
                    code = `${part.id}.say(${text}, ${adjustedRate}, "${lang}");\n`;
                return code;
            },
        }],
    };

    speaker.webAudioSupported = AudioPlayer.webAudioSupported;

    // Add speaker blocks if supported
    if (speaker.webAudioSupported) {
        speaker.ctx = AudioPlayer.context;
        speaker.blocks = speaker.blocks.concat([{
            block: part => ({
                id: 'speaker_play',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SPEAKER_PLAY}`,
                args0: [{
                    type: 'input_value',
                    name: 'SAMPLE',
                    check: 'Sample',
                }],
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: part => (block) => {
                let sample = Blockly.JavaScript.valueToCode(block, 'SAMPLE') || 'null',
                    code = `${part.id}.play(${sample});\n`;
                return code;
            },
        }, {
            block: part => ({
                id: 'speaker_loop',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SPEAKER_LOOP}`,
                args0: [{
                    type: 'input_value',
                    name: 'SAMPLE',
                    check: 'Sample',
                }],
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: part => (block) => {
                let sample = Blockly.JavaScript.valueToCode(block, 'SAMPLE') || 'null',
                    code = `${part.id}.loop(${sample});\n`;
                return code;
            },
        }, {
            block: part => ({
                id: 'speaker_stop',
                message0: `${part.name}: stop`,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: part => (block) => {
                const code = `${part.id}.stop();\n`;
                return code;
            },
        }, {
            block: (part) => {
                let sampleSet = Object.keys(samples),
                    id = 'speaker_sample';
                Blockly.Blocks[`${part.id}#${id}`] = {
                    init() {
                        const samplesArr = [];
                        Object.keys(samples).forEach((name) => {
                            samplesArr.push({ value: name });
                        });
                        const FieldSounds = FieldSoundsFactory(Blockly);
                        const field = new FieldSounds(defaultCategory, samplesArr, function onUpdate(option) {
                            this.sourceBlock_.updateShape_(option);
                        });

                        this.setColour(part.colour);

                        this.appendDummyInput()
                            .appendField(field, 'SET');

                        this.setOutput('Sample');

                        this.setInputsInline(true);

                        this.updateShape_(defaultCategory);
                    },
                    updateShape_(option, sample) {
                        this.removeInput('SAMPLE');
                        this.createInputs_(option, sample);
                    },
                    createInputs_(option, sample) {
                        let options,
                            samplesArr = [],
                            fieldDrop,
                            FieldSounds,
                            sampleLabel;
                        /* In case the sample pack doesn't exist, do a case-insensitive match
                            against all keys in the object. We need to do that because old shares
                            and exported apps all have been saved with the ids in lowercase. */
                        if (!samples[option]) {
                            Object.keys(samples).forEach((key) => {
                                if (key.toLowerCase() === option.toLowerCase()) {
                                    option = key;
                                }
                            });
                        }


                        options = Object.keys(samples[option]).map(key => [samples[option][key], key]);
                        Object.keys(samples[option]).forEach((key) => {
                            samplesArr.push({ label: samples[option][key], value: key });
                        });
                        sampleLabel = sample || samplesArr[0].label;
                        FieldSounds = FieldSoundsFactory(Blockly);
                        fieldDrop = new FieldSounds(sampleLabel, samplesArr);

                        this.appendDummyInput('SAMPLE')
                            .appendField(fieldDrop, 'SAMPLE');
                    },
                    domToMutation(xmlElement) {
                        const typeSet = xmlElement.getAttribute('set');
                        const typeSample = xmlElement.getAttribute('sample');
                        this.updateShape_(typeSet, typeSample);
                    },
                    mutationToDom() {
                        let container = document.createElement('mutation'),
                            typeSet = this.getFieldValue('SET'),
                            typeSample = this.getFieldValue('SAMPLE');
                        container.setAttribute('set', typeSet);
                        container.setAttribute('sample', typeSample);
                        return container;
                    },
                };
                return {
                    id,
                    colour: COLOUR,
                    doNotRegister: true,
                };
            },
            javascript: () => (block) => {
                const sample = block.getField('SAMPLE').value_ || 'amen';
                return [`'${sample}'`];
            },
        }, {
            block: part => ({
                id: 'speaker_playback_rate',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_SPEAKER_PLAYBACK_RATE}`,
                args0: [{
                    type: 'input_value',
                    name: 'RATE',
                    check: 'Number',
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    RATE: '<shadow type="math_number"><field name="NUM">100</field></shadow>',
                },
            }),
            javascript: part => (block) => {
                let rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 100,
                    code = `${part.id}.setPlaybackRate(${rate});\n`;
                return code;
            },
        }, {
            block: part => ({
                id: 'speaker_set_volume',
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
                let volume = Blockly.JavaScript.valueToCode(block, 'VOLUME') || 100,
                    code = `${part.id}.setVolume(${volume});\n`;
                return code;
            },
        }, {
            block: (ui) => {
                const sets = samples;
                return {
                    id: 'random_from_set',
                    message0: Blockly.Msg.BLOCK_SPEAKER_RANDOM_FROM,
                    args0: [{
                        type: 'field_dropdown',
                        name: 'SET',
                        options: ['any'].concat(Object.keys(sets)).map(key => [key, key]),
                    }],
                    output: 'Sample',
                };
            },
            javascript: ui => function (block) {
                let set = block.getFieldValue('SET') || 'drum machine',
                    code = [`${ui.id}.randomSound('${set}')`];
                return code;
            },
        }]);
    }

    return speaker;
};

export default SpeakerFactory;
