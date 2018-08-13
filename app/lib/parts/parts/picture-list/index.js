import { localize } from '../../../i18n/index.js';
import './kano-ui-picture-list.js';

/**
* Check if a block is the ancestor of another one
*/
function checkAncestor(block, type) {
    let parent = block.parentBlock_;
    if (!parent) {
        return false;
    }
    if (parent.type == type) {
        return true;
    }
    return checkAncestor(parent, type);
}

const pictureList = {
    partType: 'ui',
    type: 'picture-list',
    label: localize('PART_PICTURE_LIST_NAME'),
    image: '/assets/part/piclist.svg',
    component: 'kano-ui-picture-list',
    excludeDefaultBlocks: true,
    showDefaultConfiguration: false,
    customizable: {
        properties: [{
            key: 'speed',
            type: 'range',
            label: localize('SPEED'),
            min: 1,
            max: 30,
        }],
        style: [],
    },
    userProperties: {
        speed: 15,
    },
    colour: '#E73544',
    blocks: [{
        block: (part) => {
            return {
                id: 'length',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_LENGTH}`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return function (block) {
                return [`devices.get('${part.id}').pictures.length`];
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'add_picture',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_ADD_PICTURE}`,
                args0: [{
                    type: 'input_value',
                    name: 'PICTURE'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return function (block) {
                let picture = Blockly.JavaScript.valueToCode(block, 'PICTURE') || "''";
                return `devices.get('${part.id}').addPicture(${picture});\n`;
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'get_nth_picture',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_GET_PICTURE}`,
                args0: [{
                    type: "input_value",
                    name: "INDEX",
                    check: 'Number'
                }],
                output: true,
                shadow: {
                    'INDEX': `<shadow type="math_number"><field name="NUM">0</field></shadow>`
                }
            };
        },
        javascript: (part) => {
            return function (block) {
                let index = Blockly.JavaScript.valueToCode(block, 'INDEX') || 0;
                return [`devices.get('${part.id}').pictures[${index}] || ''`];
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'for_each_picture',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_FOR_EACH}`,
                message1: 'do %1',
                args1: [{
                    type: "input_statement",
                    name: "DO"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return function (block) {
                let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                    code = `devices.get('${part.id}').pictures.forEach(function (picture) {\n${statement}});\n`;
                return code;
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'picture',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_PICTURE}`,
                output: true
            };
        },
        javascript: (part) => {
            return function (block) {
                let code = `picture`;
                if (!checkAncestor(block, `${part.id}#for_each_picture`)) {
                    code = `devices.get('${part.id}').topPicture`;
                }
                return [code];
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'play',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_PLAY}`,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return function (block) {
                let code = `devices.get('${part.id}').play();\n`;
                return code;
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'pause',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_PAUSE}`,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return function (block) {
                let code = `devices.get('${part.id}').pause();\n`;
                return code;
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'picture_list_set_speed',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_SET_SPEED}`,
                args0: [{
                    type: 'input_value',
                    name: 'SPEED',
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'SPEED': `<shadow type="math_number"><field name="NUM">15</field></shadow>`
                },
            };
        },
        javascript: (part) => {
            return (block) => {
                let speed = Blockly.JavaScript.valueToCode(block, 'SPEED') || 15,
                    code = `devices.get('${part.id}').setSpeed(${speed});\n`;
                return code;
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'picture_download_gif',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_PICTURE_LIST_SAVE_GIF}`,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').saveGif();\n`;
                return code;
            };
        },
    }],
};

export default pictureList;
