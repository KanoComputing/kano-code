import '../elements/kano-editor-camera/kano-editor-camera.js';
import { background } from './common/background-blocks.js';
import { filters } from './common/filters.js';
import { Mode } from '../lib/index.js';

const COLOR = '#82C23D';
const definition = {
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
    defaultSource: `<xml xmlns="http://www.w3.org/1999/xhtml"><block type="global_when" x="60" y="120" id="default_event_part_id"><field name="EVENT">camera.camera-shutter-button</field><statement name="DO"><block type="camera#take_picture" id="default_take_picture_id"></block></statement></block></xml>`,
    colour: COLOR,
    parts: ['clock', 'microphone', 'mouse', 'speaker', 'synth', 'button',
                'box', 'sticker', 'map', 'picture-list',
                'scrolling-text', 'slider', 'text-input', 'text',
                'rss', 'sports', 'weather', 'iss', 'share', 'canvas',
                'motion-sensor', 'gyro-accelerometer', 'oscillator',
                'terminal'],
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
    }]
};

const categories = [];

const blocks = [{
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
.concat(background);

categories.push({
    name: definition.name,
    id: definition.id,
    colour: COLOR,
    blocks,
});

definition.categories = categories;

Mode.define(definition.id, definition);