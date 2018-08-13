import { localize } from '../../../i18n/index.js';
import './kano-ui-box.js';

const box = {
    partType: 'ui',
    type: 'box',
    label: localize('PART_BOX_NAME'),
    image: '/assets/part/box.svg',
    colour: '#E73544',
    component: 'kano-ui-box',
    customizable: {
        properties: [{
            key: 'strokeSize',
            type: 'range',
            label: localize('STROKE_SIZE'),
            symbol: 'px',
        }, {
            key: 'strokeColor',
            type: 'color',
            label: localize('STROKE_COLOR'),
        }],
        style: ['width', 'height', 'background-color'],
    },
    userStyle: {
        width: '200px',
        height: '200px',
        'background-color': '#F5F5F5',
    },
    userProperties: {
        strokeSize: '2',
        strokeColor: 'black',
    },
    events: [{
        label: localize('IS_CLICKED'),
        id: 'clicked',
    }],
    blocks: [{
        block: ui => ({
            id: 'set_stroke_size',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_BOX_SET_STROKE_SIZE}`,
            args0: [{
                type: 'input_value',
                name: 'SIZE',
                check: 'Number',
            }],
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: ui => function (block) {
            const size = Blockly.JavaScript.valueToCode(block, 'SIZE');
            return `devices.get('${ui.id}').setStrokeSize(${size});`;
        },
    }, {
        block: ui => ({
            id: 'set_stroke_colour',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_BOX_SET_STROKE_COLOR}`,
            args0: [{
                type: 'input_value',
                name: 'COLOUR',
                check: 'Colour',
            }],
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: ui => function (block) {
            const colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
            return `devices.get('${ui.id}').setStrokeColor(${colour});`;
        },
    }, {
        block: ui => ({
            id: 'set_background_colour',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_BOX_SET_BACKGROUND_COLOR}`,
            args0: [{
                type: 'input_value',
                name: 'COLOUR',
                check: 'Colour',
            }],
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: ui => function (block) {
            const colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
            return `devices.get('${ui.id}').setBackgroundColor(${colour});`;
        },
    }],
};

export default box;
