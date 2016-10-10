import general from '../parts/canvas/blocks/general';
import paths from '../parts/canvas/blocks/paths';
import setters from '../parts/canvas/blocks/setters';
import shapes from '../parts/canvas/blocks/shapes';
import space from '../parts/canvas/blocks/space';

let normal,
    blocks = [];

blocks = blocks.concat(general);

blocks.push({
    block: (ui) => {
        return {
            id: 'clear',
            message0: `${ui.name}: clear drawing`,
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (ui) => {
        return function (block) {
            return `devices.get('${ui.id}').reset();`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            return `devices.get('${ui.id}').reset();`;
        };
    }
});

blocks.push({
    block: (ui) => {
        return {
            id: 'set_transparency',
            message0: `${ui.name}: set transparency to %1`,
            args0: [{
                type: 'input_value',
                name: 'ALPHA',
                check: 'Number'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'ALPHA': '<shadow type="math_number"><field name="NUM">100</field></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let alpha = Blockly.JavaScript.valueToCode(block, 'ALPHA');
            return `devices.get('${ui.id}').setTransparency(${alpha});`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let alpha = Blockly.JavaScript.valueToCode(block, 'ALPHA');
            return `devices.get('${ui.id}').setTransparency(${alpha});`;
        };
    }
});

blocks = blocks.concat(setters);
blocks = blocks.concat(space);
blocks = blocks.concat(paths);
blocks = blocks.concat(shapes);

export default normal = {
    id: 'normal',
    name: 'Draw',
    colour: '#82C23D',
    defaultBlocks: `<xml xmlns="http://www.w3.org/1999/xhtml"><block type="part_event" x="90" y="120" id="default_part_event_id"><field name="EVENT">global.start</field></block></xml>`,
    blocks,
    allowBackground: true,
    workspace: {
        viewport: {
            width: 512,
            height: 384
        },
        component: 'kano-workspace-normal'
    },
    sharing: {},
    parts: ['clock', 'microphone', 'speaker', 'button', 'box',
                'sticker', 'map', 'scrolling-text', 'slider',
                'text-input', 'text', 'rss', 'sports', 'weather', 'iss',
                'share', 'canvas', 'oscillator']
};
