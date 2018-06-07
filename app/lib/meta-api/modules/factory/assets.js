export const AssetsModuleFactory = (stickers, defaultSet) => {
    const COLOR = '#1198ff';

    return class BlocklyAssets {
        static get type() { return 'blockly'; }
        static get id() { return 'assets'; }
        static register(Blockly) {
            const stickerSet = Object.keys(stickers);
            Blockly.Blocks.assets_get_sticker = {
                init: function init() {
                    const setDropdown = new Blockly.FieldDropdown(
                        stickerSet.map(name => [name, name]),
                        function validate(option) {
                            this.sourceBlock_.updateShape_(option);
                        },
                    );

                    this.appendDummyInput()
                        .appendField(setDropdown, 'SET');

                    this.setOutput('String');

                    this.setColour(COLOR);

                    this.setInputsInline(true);

                    this.createInputs_(defaultSet);
                },
                updateShape_(option) {
                    this.removeInput('STICKER');
                    this.createInputs_(option);
                },
                createInputs_(option) {
                    const options = Object.keys(stickers[option])
                        .map(key => [stickers[option][key], key]);
                    const dropdown = new Blockly.FieldDropdown(options);
                    this.appendDummyInput('STICKER')
                        .appendField(dropdown, 'STICKER');
                },
                domToMutation(xmlElement) {
                    const type = xmlElement.getAttribute('set');
                    this.updateShape_(type);
                },
                mutationToDom() {
                    const container = document.createElement('mutation');
                    const type = this.getFieldValue('SET');
                    container.setAttribute('set', type);
                    return container;
                },
            };

            Blockly.JavaScript.assets_get_sticker = (block) => {
                const sticker = block.getFieldValue('STICKER');
                const set = block.getFieldValue('SET');
                return [`assets.getSticker('${set}', '${sticker}')`];
            };

            Blockly.Blocks.assets_random_sticker = {
                init() {
                    this.jsonInit({
                        id: 'random_sticker',
                        message0: Blockly.Msg.BLOCK_STICKER_RANDOM,
                        colour: COLOR,
                        output: 'String',
                    });
                },
            };

            Blockly.JavaScript.assets_random_sticker = (block) => {
                const code = ['assets.randomSticker()'];
                return code;
            };

            Blockly.Blocks.assets_random_sticker_from = {
                init() {
                    this.jsonInit({
                        id: 'random_from_set',
                        message0: Blockly.Msg.BLOCK_STICKER_RANDOM_FROM,
                        args0: [{
                            type: 'field_dropdown',
                            name: 'SET',
                            options: Object.keys(stickers).map(key => [key, key]),
                        }],
                        colour: COLOR,
                        output: 'String',
                    });
                },
            };

            Blockly.JavaScript.assets_random_sticker_from = (block) => {
                const set = block.getFieldValue('SET') || 'animals';
                const code = [`assets.randomSticker('${set}')`];
                return code;
            };
        }
    };
};

export default AssetsModuleFactory;
