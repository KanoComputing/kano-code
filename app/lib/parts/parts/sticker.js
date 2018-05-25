import { localize } from '../../i18n/index.js';
import { stickers } from '../../../scripts/kano/make-apps/files/stickers.js';

const COLOR = '#E73544';

const sticker = {
    partType: 'ui',
    type: 'sticker',
    label: localize('PART_STICKER_NAME'),
    image: '/assets/part/image.svg',
    colour: COLOR,
    customizable: {
        properties: [{
            key: 'src',
            type: 'image',
            label: localize('IMAGE'),
            options: {
                files: 'stickers'
            }
        }, {
            key: 'size',
            type: 'range',
            label: localize('SIZE'),
            symbol: 'px',
            min: 0,
            max: 100
        }],
        style: []
    },
    nonvolatileProperties: [
        'src', 'size'
    ],
    userProperties: {
        size: 100
    },
    events: [{
        label: localize('IS_CLICKED'),
        id: 'clicked'
    }],
    blocks: [{
        block: (part) => {
            return {
                id: 'set_sticker',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_STICKER_SET}`,
                args0: [{
                    type: "input_value",
                    name: "PICTURE",
                    check: 'String'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'PICTURE': `<shadow type="assets_get_sticker"></shadow>`
                }
            };
        },
        javascript: (part) => {
            return function (block) {
                let pic = Blockly.JavaScript.valueToCode(block, 'PICTURE'),
                    code = `devices.get('${part.id}').setSticker(${pic});\n`;
                return code;
            };
        }
    },
    'assets_get_sticker',
    'assets_random_sticker',
    'assets_random_sticker_from'
    ],
    legacyBlocks: [{
        block: (part) => {
            let stickerSet = Object.keys(stickers),
                id = 'sticker';
            Blockly.Blocks[`${part.id}#${id}`] = {
                init: function () {

                    let setDropdown = new Blockly.FieldDropdown(stickerSet.map(name => [name, name]), function (option) {
                        this.sourceBlock_.updateShape_(option);
                    });

                    this.appendDummyInput()
                        .appendField(setDropdown, 'SET');

                    this.setOutput('String');

                    this.setColour(part.colour);

                    this.setInputsInline(true);

                    this.createInputs_('animals');
                },
                updateShape_: function (option) {
                    this.removeInput('STICKER');
                    this.createInputs_(option);
                },
                createInputs_: function (option) {
                    let options = Object.keys(stickers[option]).map(key => [stickers[option][key], key]),
                        dropdown = new Blockly.FieldDropdown(options);
                    this.appendDummyInput('STICKER')
                        .appendField(dropdown, 'STICKER');
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
                doNotRegister: true
            };
        },
        javascript: (part) => {
            return (block) => {
                let sticker = block.getFieldValue('STICKER'),
                    set = block.getFieldValue('SET');
                return [`parts.get('${part.id}').getSticker('${set}', '${sticker}')`];
            };
        }
    }, {
        block: (ui) => {
            return {
                id: 'random_sticker',
                message0: Blockly.Msg.BLOCK_STICKER_RANDOM,
                output: 'String'
            };
        },
        javascript: (ui) => {
            return function (block) {
                let code = [`parts.get('${ui.id}').randomSticker()`];
                return code;
            };
        }
    }, {
        block: (ui) => {
            let sets = stickers;
            return {
                id: 'random_from_set',
                message0: Blockly.Msg.BLOCK_STICKER_RANDOM_FROM,
                args0: [{
                    type: 'field_dropdown',
                    name: 'SET',
                    options: Object.keys(sets).map(key => [key, key])
                }],
                output: 'String'
            };
        },
        javascript: (ui) => {
            return function (block) {
                let set = block.getFieldValue('SET') || 'animals',
                    code = [`parts.get('${ui.id}').randomSticker('${set}')`];
                return code;
            };
        }
    }]
};

export default sticker;
