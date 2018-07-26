import { FieldAssetPicker } from '../../../../scripts/kano/make-apps/blockly/inputs/asset-picker.js';
import { localize } from '../../../i18n/index.js';
import { AudioPlayer } from '../../../../scripts/kano/music/player.js';
import './kano-part-speaker.js';

const SpeakerFactory = (appRoot, samples, samplesDir, defaultCategory) => {
    const COLOUR = '#FFB347';

    const root = `${appRoot}/assets/audio/samples/`;

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
                SET: 'Wand',
                SAMPLE: {
                    id: 'wand/crack.wav',
                    label: 'Crack',
                }
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
                    code = `parts.get('${part.id}').say(${text}, ${adjustedRate}, "${lang}");\n`;
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
                    code = `parts.get('${part.id}').play(${sample});\n`;
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
                    code = `parts.get('${part.id}').loop(${sample});\n`;
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
                const code = `parts.get('${part.id}').stop();\n`;
                return code;
            },
        }, {
            block: (part) => {
                let sampleSet = Object.keys(samples),
                    id = 'speaker_sample';
                Blockly.Blocks[`${part.id}#${id}`] = {
                    init() {
                        const setDropdown = new Blockly.FieldDropdown(sampleSet.map(name => [name, name]), function (option) {
                            this.sourceBlock_.updateShape_(option);
                        });

                        this.setColour(part.colour);

                        this.appendDummyInput()
                            .appendField(setDropdown, 'SET');

                        this.setOutput('Sample');

                        this.setInputsInline(true);

                        this.updateShape_(defaultCategory);
                    },
                    updateShape_(option) {
                        this.removeInput('SAMPLE');
                        this.createInputs_(option);
                    },
                    createInputs_(option) {
                        let options,
                            dropdown;
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

                        options = Object.keys(samples[option]).map(key => [samples[option][key], key]),
                        dropdown = new Blockly.FieldDropdown(options);
                        const texts = dropdown.getText();

                        this.appendDummyInput('SAMPLE')
                            .appendField(dropdown, 'SAMPLE');
                    },
                    domToMutation(xmlElement) {
                        const type = xmlElement.getAttribute('set');
                        this.updateShape_(type);
                    },
                    mutationToDom() {
                        let container = document.createElement('mutation'),
                            type = this.getFieldValue('SET');
                        container.setAttribute('set', type);
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
                const sample = block.getFieldValue('SAMPLE') || 'amen';
                return [`'${sample}'`];
            },
        }, {
        //     block: (part) => {
        //         let samples = samplesDir,
        //             id = 'speaker_sample_picker';
        //         Blockly.Blocks[`${part.id}#${id}`] = {
        //             init() {
        //                 const defaultCat = samples.children[0];

        //                 const setDropdown = new FieldAssetPicker(Blockly.Msg.BLOCK_SPEAKER_PICKER_HEADING, 'samples', samples, { path: `${samples.name}/${defaultCat.name}`, item: defaultCat.children[0] }, root);

        //                 this.setColour(part.colour);

        //                 this.appendDummyInput()
        //                     .appendField(setDropdown, 'SAMPLE');

        //                 this.setOutput('Sample');

        //                 this.setInputsInline(true);
        //             },
        //             domToMutation(xmlElement) {
        //                 const field = this.getField('SAMPLE');
        //                 field.load(xmlElement);
        //             },
        //             mutationToDom() {
        //                 const container = document.createElement('mutation');
        //                 const field = this.getField('SAMPLE');
        //                 field.save(container);
        //                 return container;
        //             },
        //         };
        //         return {
        //             id,
        //             colour: COLOUR,
        //             doNotRegister: true,
        //         };
        //     },
        //     javascript: () => (block) => {
        //         const field = block.getField('SAMPLE');
        //         const value = field.getExtendedValue();
        //         return [`'${value ? value.item.filename : 'amen'}'`];
        //     },
        // }, {
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
                    code = `parts.get('${part.id}').setPlaybackRate(${rate});\n`;
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
                    code = `parts.get('${part.id}').setVolume(${volume});\n`;
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
                    code = [`parts.get('${ui.id}').randomSound('${set}')`];
                return code;
            },
        }]);
    }

    return speaker;
};

export const labelMap = new Map();

const original = Blockly.FieldDropdown;

Blockly.FieldDropdown = class f extends original {
    constructor(options, ...args) {
        super(options, ...args);
        options.forEach((opt) => {
            labelMap.set(opt[1], opt[0]);
        });
    }
}
export default SpeakerFactory;


