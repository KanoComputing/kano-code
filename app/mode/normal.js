import '../elements/kano-editor-normal/kano-editor-normal.js';
import general from '../lib/parts/parts/canvas/blocks/general.js';
import paths from '../lib/parts/parts/canvas/blocks/paths.js';
import setters from '../lib/parts/parts/canvas/blocks/setters.js';
import shapes from '../lib/parts/parts/canvas/blocks/shapes.js';
import space from '../lib/parts/parts/canvas/blocks/space.js';
import { Mode } from '../lib/index.js';

const COLOR = '#82C23D';
const definition = {
    id: 'normal',
    name: 'Draw',
    colour: COLOR,
    defaultSource: `<xml xmlns="http://www.w3.org/1999/xhtml"><block type="part_event" x="60" y="120" id="default_part_event_id"><field name="EVENT">global.start</field></block></xml>`,
    allowBackground: true,
    workspace: {
        viewport: {
            width: 512,
            height: 384
        },
        component: 'kano-workspace-normal'
    },
    sharing: {},
    parts: ['clock', 'microphone', 'mouse', 'speaker', 'synth', 'button',
                'box', 'sticker', 'map', 'scrolling-text', 'slider',
                'text-input', 'text', 'rss', 'sports', 'weather', 'iss',
                'share', 'canvas', 'oscillator', 'motion-sensor', 'gyro-accelerometer',
                'terminal'],
};

const categories = [];
let blocks = [];

blocks = blocks.concat(general);

blocks.push({
    block: (part) => {
        return {
            id: 'clear',
            message0: `${part.name}: clear drawing`,
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part) => {
        return function (block) {
            return `devices.get('${part.id}').reset();`;
        };
    }
});

blocks.push({
    block: (part) => {
        return {
            id: 'set_transparency',
            message0: `${part.name}: set transparency to %1`,
            args0: [{
                type: 'input_value',
                name: 'ALPHA',
                check: 'Number'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'ALPHA': `<shadow type="math_number"><field name="NUM">100</field></shadow>`
            }
        };
    },
    javascript: (part) => {
        return function (block) {
            let alpha = Blockly.JavaScript.valueToCode(block, 'ALPHA');
            return `devices.get('${part.id}').setTransparency(${alpha});`;
        };
    }
});

blocks = blocks.concat(setters);
blocks = blocks.concat(space);
blocks = blocks.concat(paths);
blocks = blocks.concat(shapes);

categories.push({
    name: definition.name,
    id: definition.id,
    colour: COLOR,
    blocks,
});

definition.categories = categories;

Mode.define(definition.id, definition);
