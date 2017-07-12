/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOR = '#1198ff';

    let stickerSet = Object.keys(Kano.MakeApps.Files.stickers);

    let register = (Blockly) => {
        Blockly.Blocks.assets_get_sticker = {
            init: function () {

                let setDropdown = new Blockly.FieldDropdown(stickerSet.map(name => [name, name]), function (option) {
                    this.sourceBlock_.updateShape_(option);
                });

                this.appendDummyInput()
                    .appendField(setDropdown, 'SET');

                this.setOutput('String');

                this.setColour(COLOR);

                this.setInputsInline(true);

                this.createInputs_('animals');
            },
            updateShape_: function (option) {
                this.removeInput('STICKER');
                this.createInputs_(option);
            },
            createInputs_: function (option) {
                let stickers = Kano.MakeApps.Files.stickers,
                    options  = Object.keys(stickers[option]).map(key => [stickers[option][key], key]),
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
                    type      = this.getFieldValue('SET');
                container.setAttribute('set', type);
                return container;
            }
        };

        Blockly.JavaScript.assets_get_sticker = function (block) {
            let sticker = block.getFieldValue('STICKER'),
                set     = block.getFieldValue('SET');
            return [`assets.getSticker('${set}', '${sticker}')`];
        };

        Blockly.Pseudo.assets_get_sticker = function (block) {
            let sticker = block.getFieldValue('STICKER'),
                set     = block.getFieldValue('SET');
            return [`assets.getSticker('${set}', '${sticker}')`];
        };

        Blockly.Blocks.assets_random_sticker = {
            init: function () {
                this.jsonInit({
                    id      : 'random_sticker',
                    message0: Blockly.Msg.BLOCK_STICKER_RANDOM,
                    colour  : COLOR,
                    output  : 'String'
                });
            }
        };

        Blockly.JavaScript.assets_random_sticker = function (block) {
            let code = ['assets.randomSticker()'];
            return code;
        };

        Blockly.Pseudo.assets_random_sticker = function (block) {
            let code = ['assets.randomSticker()'];
            return code;
        };

        Blockly.Blocks.assets_random_sticker_from = {
            init: function () {
                this.jsonInit({
                    id      : 'random_from_set',
                    message0: Blockly.Msg.BLOCK_STICKER_RANDOM_FROM,
                    args0   : [{
                        type   : 'field_dropdown',
                        name   : 'SET',
                        options: Object.keys(Kano.MakeApps.Files.stickers).map(key => [key, key])
                    }],
                    colour: COLOR,
                    output: 'String'
                });
            }
        };

        Blockly.JavaScript.assets_random_sticker_from = function (block) {
            let set  = block.getFieldValue('SET') || 'animals',
                code = [`assets.randomSticker('${set}')`];
            return code;
        };

        Blockly.Pseudo.assets_random_sticker_from = function (block) {
            let set  = block.getFieldValue('SET') || 'animals',
                code = [`assets.randomSticker('${set}')`];
            return code;
        };
    };

    Kano.MakeApps.Blockly.addModule('assets', { register });

})(window.Kano = window.Kano || {});