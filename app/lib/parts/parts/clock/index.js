import { localize } from '../../../i18n/index.js';
import './kano-part-clock.js';

const clock = {
    partType: 'data',
    type: 'clock',
    label: localize('PART_CLOCK_NAME'),
    image: '/assets/part/clock.svg',
    component: 'kano-part-clock',
    excludeBlocks: ['refresh'],
    excludeEvents: ['update'],
    method: 'clock.noop',
    configPanel: 'kano-ui-editor',
    singleton: true,
    blocks: [{
        block: ui => ({
            id: 'get_time',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_CLOCK_CURRENT}`,
            output: 'Number',
            args0: [{
                type: 'field_dropdown',
                name: 'FIELD',
                options: [
                    [
                        Blockly.Msg.BLOCK_CLOCK_YEAR,
                        'year',
                    ],
                    [
                        Blockly.Msg.BLOCK_CLOCK_MONTH,
                        'month',
                    ],
                    [
                        Blockly.Msg.BLOCK_CLOCK_DAY,
                        'day',
                    ],
                    [
                        Blockly.Msg.BLOCK_CLOCK_HOUR,
                        'hour',
                    ],
                    [
                        Blockly.Msg.BLOCK_CLOCK_MINUTE,
                        'minute',
                    ],
                    [
                        Blockly.Msg.BLOCK_CLOCK_SECONDS,
                        'seconds',
                    ],
                ],
            }],
        }),
        javascript: () => (block) => {
            let field = block.getFieldValue('FIELD'),
                code = `date.getCurrent().${field}`;
            return [code];
        },
    }, {
        block: ui => ({
            id: 'get_formatted_time',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_CLOCK_CURRENT}`,
            output: 'String',
            args0: [{
                type: 'field_dropdown',
                name: 'FIELD',
                options: [
                    [
                        Blockly.Msg.BLOCK_CLOCK_DATE,
                        'date',
                    ],
                    [
                        Blockly.Msg.BLOCK_CLOCK_TIME,
                        'time',
                    ],
                ],
            }],
        }),
        javascript: () => (block) => {
            let field = block.getFieldValue('FIELD'),
                code;
            if (field === 'date') {
                code = 'date.getFormattedDate()';
            } else {
                code = 'date.getFormattedTime()';
            }
            return [code];
        },
    }],
};

export default clock;
