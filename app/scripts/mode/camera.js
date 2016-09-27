import backgroundBlocks from './common/background-blocks';
import filters from './common/filters';

let Camera;

export default Camera = {
    id: 'camera',
    name: 'Camera',
    allowBackground: true,
    workspace: {
        viewport: {
            width: 512,
            height: 384
        },
        component: 'kano-workspace-camera'
    },
    sharing: {
        cover: 'still'
    },
    defaultBlocks: `<xml xmlns="http://www.w3.org/1999/xhtml"><block type="part_event" x="83" y="102" id="default_event_part_id"><field name="EVENT">camera.camera-shutter-button</field><statement name="DO"><block type="camera#take_picture" id="default_take_picture_id"></block></statement></block></xml>`,
    colour: '#82C23D',
    parts: ['clock', 'microphone', 'speaker', 'button', 'box',
                'sticker', 'map', 'picture-list',
                'scrolling-text', 'slider', 'text-input', 'text',
                'rss', 'sports', 'weather', 'iss', 'share', 'canvas',
                'proximity-sensor', 'motion-sensor', 'gesture-sensor',
                'gyro-accelerometer'],
    events: [{
        label: 'takes picture',
        id: 'picture-taken'
    }, {
        label: 'shutter pushed',
        id: 'camera-shutter-button'
    }, {
        label: 'timer turns left',
        id: 'camera-timer-cw'
    }, {
        label: 'timer turns right',
        id: 'camera-timer-ccw'
    }],
    blocks: [{
        block: () => {
            return {
                id: 'take_picture',
                message0: 'Camera: take picture',
                args0: [],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').takePicture();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').takePicture();\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'last_picture',
                message0: 'Camera: last picture taken',
                args0: [],
                inputsInline: true,
                output: 'String'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').lastPicture()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').lastPicture()`;
                return [code];
            };
        }
    }, {
        block: () => {
            return {
                id: 'ledring_flash',
                message0: 'Led ring: flash color %1 duration %2',
                args0: [{
                    type: "input_value",
                    name: "COLOR",
                    check: 'Colour'
                },{
                    type: "input_value",
                    name: "LENGTH",
                    check: "Number",
                    align: "RIGHT"
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'LENGTH': '<shadow type="math_number"><field name="NUM">200</field></shadow>',
                    'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let length = Blockly.JavaScript.valueToCode(block, 'LENGTH') || 200,
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').flash(${color}, ${length});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let length = Blockly.JavaScript.valueToCode(block, 'LENGTH') || 200,
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').flash(${color}, ${length});\n`;
                return code;
            };
        }
    }].concat(filters)
    .concat([{
        block: () => {
            return {
                id: 'camera_save_picture',
                message0: 'Camera: save picture',
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').savePicture();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').savePicture();\n`;
                return code;
            };
        }
    }])
    .concat(backgroundBlocks)
};
