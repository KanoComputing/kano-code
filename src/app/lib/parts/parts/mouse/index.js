import { localize } from '../../../i18n/index.js';
import './kano-part-mouse.js';

export const event = {
    type: 'function',
    name: 'on',
    verbose: 'Mouse: on',
    parameters: [{
        name: 'type',
        returnType: 'Enum',
        verbose: '',
        enum: [
            [Blockly.Msg.BLOCK_MOUSE_DOWN, 'down'],
            [Blockly.Msg.BLOCK_MOUSE_UP, 'up'],
            [Blockly.Msg.BLOCK_MOUSE_MOVE, 'move'],
        ],
    }, {
        name: 'callback',
        verbose: '',
        returnType: Function,
    }],
};

export const x = {
    type: 'variable',
    name: 'x',
    verbose: 'Mouse: x',
    returnType: Number,
};

export const y = {
    type: 'variable',
    name: 'y',
    verbose: 'Mouse: y',
    returnType: Number,
};

export const speedX = {
    type: 'variable',
    name: 'xSpeed',
    verbose: 'Mouse: x speed',
    returnType: Number,
};

export const speedY = {
    type: 'variable',
    name: 'ySpeed',
    verbose: 'Mouse: y speed',
    returnType: Number,
};

const blocks = {
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
            const cursor = Blockly.JavaScript.valueToCode(block, 'CURSOR');
            const code = `devices.get('${part.id}').setCursor(${cursor});\n`;
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
    symbols: [
        event,
        x,
        y,
        speedX,
        speedY,
    ],
    blocks: [
        blocks.setCursor,
        'assets_get_sticker',
        'assets_random_sticker',
        'assets_random_sticker_from',
    ],
};

export default mouse;
