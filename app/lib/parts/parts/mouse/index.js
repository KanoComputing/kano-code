import { localize } from '../../../i18n/index.js';
import './kano-part-mouse.js';

const blocks = {
    onEvent: {
        block: ui => ({
            id: 'mouse_event',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_MOUSE_EVENT}`,
            args0: [{
                type: 'field_dropdown',
                name: 'TYPE',
                options: [
                    [Blockly.Msg.BLOCK_MOUSE_DOWN, 'down'],
                    [Blockly.Msg.BLOCK_MOUSE_UP, 'up'],
                    [Blockly.Msg.BLOCK_MOUSE_MOVE, 'move'],
                ],
            }],
            message1: '%1',
            args1: [{
                type: 'input_statement',
                name: 'DO',
            }],
        }),
        javascript: part => (block) => {
            let type = block.getFieldValue('TYPE'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                code = `devices.get('${part.id}').on('${type}', function (){\n${statement}});\n`;
            return code;
        },
    },
    mouseX: {
        block: ui => ({
            id: 'mouse_x',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_MOUSE_X}`,
            output: 'Number',
        }),
        javascript: part => (block) => {
            const code = `devices.get('${part.id}').getX()`;
            return [code];
        },
    },
    mouseY: {
        block: ui => ({
            id: 'mouse_y',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_MOUSE_Y}`,
            output: 'Number',
        }),
        javascript: part => (block) => {
            const code = `devices.get('${part.id}').getY()`;
            return [code];
        },
    },
    speedX: {
        block: ui => ({
            id: 'mouse_speed_x',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_MOUSE_SPEED_X}`,
            output: 'Number',
        }),
        javascript: part => (block) => {
            const code = `devices.get('${part.id}').getXSpeed()`;
            return [code];
        },
    },
    speedY: {
        block: ui => ({
            id: 'mouse_speed_y',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_MOUSE_SPEED_Y}`,
            output: 'Number',
        }),
        javascript: part => (block) => {
            const code = `devices.get('${part.id}').getYSpeed()`;
            return [code];
        },
    },
    setCursor: {
        block: ui => ({
            id: 'mouse_set_cursor',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_MOUSE_SET_CURSOR}`,
            args0: [{
                type: 'input_value',
                name: 'CURSOR',
                check: 'String',
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                CURSOR: '<shadow type="assets_get_sticker"></shadow>',
            },
        }),
        javascript: part => (block) => {
            let cursor = Blockly.JavaScript.valueToCode(block, 'CURSOR'),
                code = `devices.get('${part.id}').setCursor(${cursor});\n`;
            return code;
        },
    },
};

const mouse = {
    partType: 'hardware',
    type: 'mouse',
    label: localize('PART_MOUSE_NAME'),
    component: 'kano-part-mouse',
    image: '/assets/part/mouse.svg',
    colour: '#FFB347',
    singleton: true,
    blocks: [
        blocks.onEvent,
        blocks.mouseX,
        blocks.mouseY,
        blocks.speedX,
        blocks.speedY,
        blocks.setCursor,
        'assets_get_sticker',
        'assets_random_sticker',
        'assets_random_sticker_from',
    ],
};

export default mouse;
