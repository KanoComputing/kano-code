/* globals Blockly */

let sticker;

const COLOR = '#E73544';

export default sticker = {
    partType: 'ui',
    type: 'sticker',
    label: 'Sticker',
    image: '/assets/part/image.svg',
    colour: COLOR,
    customizable: {
        properties: [{
            key: 'src',
            type: 'image',
            label: 'Image',
            options: {
                files: 'stickers'
            }
        }, {
            key: 'size',
            type: 'size',
            label: 'Size',
            symbol: 'pixels'
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
        label: 'is clicked',
        id: 'clicked'
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'set_sticker',
                message0: `${ui.name}: set to %1`,
                args0: [{
                    type: "input_value",
                    name: "PICTURE",
                    check: 'String'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let pic = Blockly.JavaScript.valueToCode(block, 'PICTURE'),
                    code = `devices.get('${ui.id}').setSticker(${pic});\n`;
                return code;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let pic = Blockly.Pseudo.valueToCode(block, 'PICTURE'),
                    code = `${ui.id}.setSticker(${pic});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            let stickerSet = Object.keys(Kano.MakeApps.Files.stickers),
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
                    let stickers = Kano.MakeApps.Files.stickers,
                        options = Object.keys(stickers[option]).map(key => [stickers[option][key], key]),
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
        },
        pseudo: () => {
            return (block) => {
                let sample = block.getFieldValue('STICKER') || 'amen';
                return [`'${sample}'`];
            };
        }
    }, {
        block: (ui) => {
            return {
                id: 'random_sticker',
                message0: `random sticker`,
                output: 'String'
            };
        },
        javascript: (ui) => {
            return function (block) {
                let code = [`parts.get('${ui.id}').randomSticker()`];
                return code;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let code = [`parts.get('${ui.id}').randomSticker()`];
                return code;
            };
        }
    }, {
        block: (ui) => {
            let sets = Kano.MakeApps.Files.stickers;
            return {
                id: 'random_from_set',
                message0: `random %1`,
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
        },
        pseudo: (ui) => {
            return function (block) {
                let set = block.getFieldValue('SET') || 'animals',
                    code = [`parts.get('${ui.id}').randomSticker('${set}')`];
                return code;
            };
        }
    }]
};
