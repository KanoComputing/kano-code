import { localize } from '../../../i18n/index.js';
import '../../../../elements/kano-motion-sensor-part-editor/kano-motion-sensor-part-editor.js';

const COLOR = '#FFB347';

const motionSensor = {
    partType: 'hardware',
    type: 'motion-sensor',
    label: localize('PART_MOTION_SENSOR_NAME'),
    image: '/assets/part/motion.svg',
    colour: COLOR,
    component: 'kano-part-motion-sensor',
    configPanel: 'kano-motion-sensor-part-editor',
    customizable: {
        properties: [
            {
                key: 'mode',
                type: 'list',
                label: localize('MODE'),
                value: 'proximity',
                options: [{
                    value: 'proximity',
                    label: localize('PROXIMITY')
                }, {
                    value: 'gesture',
                    label: localize('GESTURE')
                }]
            }, {
                key: 'updateInterval',
                type: 'range',
                label: localize('UPDATE_INTERVAL'),
                min: 50,
                max: 1000
            }
        ],
        style: []
    },
    userProperties: {
        mode: 'proximity',
        updateInterval: 100
    },
    supportedHardware: ['motion-sensor', /* Old name */'proximity-sensor'],
    events: [{
        label: localize('PART_GYRO_ACCELEROMETER_READ_DATA'),
        id: 'proximity-update'
    },{
        label: localize('PART_MOTION_SENSOR_UP'),
        id: 'gesture-up'
    },
    {
        label: localize('PART_MOTION_SENSOR_DOWN'),
        id: 'gesture-down'
    },
    {
        label: localize('PART_MOTION_SENSOR_LEFT'),
        id: 'gesture-left'
    },
    {
        label: localize('PART_MOTION_SENSOR_RIGHT'),
        id: 'gesture-right'
    }],
    blocks: [{
        block: (part) => {
            const id = 'motion_when';
            Blockly.Blocks[`${part.id}#${id}`] = {
                init: function () {
                    this.appendDummyInput()
                        .appendField(`${part.name}: ${Blockly.Msg.BLOCK_MOTION_WHEN}`)
                        .appendField(new Blockly.FieldMotionZone(1, part), 'ZONE')
                        .appendField(Blockly.Msg.BLOCK_MOTION_IS_TRIGGERED);

                    this.appendStatementInput('DO');

                    this.setColour(part.colour);
                },
            };
            return {
                id,
                doNotRegister: true,
            };
        },
        javascript: (part) => {
            return (block) => {
                let zone = block.getFieldValue('ZONE'),
                    statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                    code = `devices.get('${part.id}').whenEntersZone(${zone}, function () {\n${statement}\n})`;
                return code;
            };
        },
    }, {
        block: (part) => {
            return {
                id: 'motion_sensor_value',
                message0: `${part.name} ${Blockly.Msg.BLOCK_VALUE}`,
                inputsInline: false,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getValue()`;
                return [code];
            };
        },
    }],
};

export default motionSensor;
