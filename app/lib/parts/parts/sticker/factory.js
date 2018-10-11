import { localize } from '../../../i18n/index.js';
import { StickerResolver } from './resolver.js';

export const StickerFactory = (appRoot, stickers) => {
    const COLOR = '#E73544';

    const root = `${appRoot}/assets/part/stickers/`;

    let group;
    let groupFiles;
    const files = Object.keys(stickers).reduce((acc, groupKey) => {
        group = stickers[groupKey];
        groupFiles = Object.keys(group).map(key => ({
            name: group[key],
            type: 'image',
            data: {
                src: StickerResolver.resolve(root, groupKey, key),
            },
        }));
        return acc.concat(groupFiles);
    }, []);

    const sticker = {
        partType: 'ui',
        type: 'sticker',
        label: localize('PART_STICKER_NAME'),
        image: '/assets/part/image.svg',
        colour: COLOR,
        config: {
            assetsRoot: root,
            stickers,
        },
        customizable: {
            properties: [{
                key: 'src',
                type: 'image',
                label: localize('IMAGE'),
                options: {
                    root,
                    files,
                },
            }, {
                key: 'size',
                type: 'range',
                label: localize('SIZE'),
                symbol: 'px',
                min: 0,
                max: 100,
            }],
            style: [],
        },
        nonvolatileProperties: [
            'src', 'size',
        ],
        userProperties: {
            size: 100,
        },
        events: [{
            label: localize('IS_CLICKED'),
            id: 'clicked',
        }],
        blocks: [{
            block: part => ({
                id: 'set_sticker',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_STICKER_SET}`,
                args0: [{
                    type: 'input_value',
                    name: 'PICTURE',
                    check: 'String',
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    PICTURE: '<shadow type="assets_get_sticker"></shadow>',
                },
            }),
            javascript: part => function javascript(block) {
                const pic = Blockly.JavaScript.valueToCode(block, 'PICTURE');
                const code = `devices.get('${part.id}').setSticker(${pic});\n`;
                return code;
            },
        },
        'assets_get_sticker',
        'assets_random_sticker',
        'assets_random_sticker_from',
        ],
        legacyBlocks: [{
            block: (part) => {
                const stickerSet = Object.keys(stickers);
                const id = 'sticker';
                Blockly.Blocks[`${part.id}#${id}`] = {
                    init() {
                        const setDropdown = new Blockly.FieldDropdown(
                            stickerSet.map(name => [name, name]),
                            function validator(option) {
                                this.sourceBlock_.updateShape_(option);
                            },
                        );

                        this.appendDummyInput()
                            .appendField(setDropdown, 'SET');

                        this.setOutput('String');

                        this.setColour(part.colour);

                        this.setInputsInline(true);

                        this.createInputs_('animals');
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
                return {
                    id,
                    doNotRegister: true,
                };
            },
            javascript: part => (block) => {
                const stickerValue = block.getFieldValue('STICKER');
                const set = block.getFieldValue('SET');
                return [`parts.get('${part.id}').getSticker('${set}', '${stickerValue}')`];
            },
        }, {
            block: () => ({
                id: 'random_sticker',
                message0: Blockly.Msg.BLOCK_STICKER_RANDOM,
                output: 'String',
            }),
            javascript: ui => function javascript() {
                const code = [`parts.get('${ui.id}').randomSticker()`];
                return code;
            },
        }, {
            block: () => {
                const sets = stickers;
                return {
                    id: 'random_from_set',
                    message0: Blockly.Msg.BLOCK_STICKER_RANDOM_FROM,
                    args0: [{
                        type: 'field_dropdown',
                        name: 'SET',
                        options: Object.keys(sets).map(key => [key, key]),
                    }],
                    output: 'String',
                };
            },
            javascript: ui => function javascript(block) {
                const set = block.getFieldValue('SET') || 'animals';
                const code = [`parts.get('${ui.id}').randomSticker('${set}')`];
                return code;
            },
        }],
    };

    return sticker;
};

export default StickerFactory;

