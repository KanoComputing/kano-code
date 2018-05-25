import { localize } from '../../i18n/index.js';

const scrollingText = {
    partType: 'ui',
    type: 'scrolling-text',
    label: localize('PART_SCROLL_NAME'),
    image: '/assets/part/scrolling-text.svg',
    colour: '#E73544',
    customizable: {
        properties: [{
            key: 'text',
            type: 'text',
            label: 'Text',
        }],
        style: ['font-family', 'color', 'width', 'height']
    },
    userStyle: {
        'font-family': 'Bariol',
        width: '200px',
        height: '50px',
        color: '#000000',
    },
    userProperties: {
        text: localize('SCROLL_DEFAULT')
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'scroll',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_SCROLL_SCROLL}`,
                args0: [{
                    type: "input_value",
                    name: "TEXT",
                }],
                previousStatement: null,
                nextStatement: null,
            };
        },
        javascript: (ui) => {
            return function (block) {
                let text = Blockly.JavaScript.valueToCode(block, 'TEXT'),
                    code = `devices.get('${ui.id}').scroll(${text});\n`;
                return code;
            };
        },
    }],
};

export default scrollingText;
