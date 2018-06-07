import '../elements/kano-editor-normal/kano-editor-normal.js';
import general from '../lib/parts/parts/canvas/blocks/general.js';
import paths from '../lib/parts/parts/canvas/blocks/paths.js';
import setters from '../lib/parts/parts/canvas/blocks/setters.js';
import shapes from '../lib/parts/parts/canvas/blocks/shapes.js';
import space from '../lib/parts/parts/canvas/blocks/space.js';
import { Mode } from '../lib/index.js';
import UI from '../lib/parts/ui/index.js';
import Data from '../lib/parts/data/index.js';
import Hardware from '../lib/parts/hardware/index.js';

import Box from '../lib/parts/parts/box/index.js';
import Button from '../lib/parts/parts/button/index.js';
import Clock from '../lib/parts/parts/clock/index.js';
import MapPart from '../lib/parts/parts/map/index.js';
import Microphone from '../lib/parts/parts/microphone/index.js';
import Mouse from '../lib/parts/parts/mouse/index.js';
import Oscillator from '../lib/parts/parts/oscillator/index.js';
import ScrollingText from '../lib/parts/parts/scrolling-text/index.js';
import Slider from '../lib/parts/parts/slider/index.js';
import Speaker from '../lib/parts/parts/speaker/index.js';
import Sticker from '../lib/parts/parts/sticker/index.js';
import Synth from '../lib/parts/parts/synth/index.js';
import Terminal from '../lib/parts/parts/terminal/index.js';
import TextInput from '../lib/parts/parts/text-input/index.js';
import Text from '../lib/parts/parts/text/index.js';
import RSS from '../lib/parts/parts/data/rss.js';
import Sports from '../lib/parts/parts/data/sports.js';
import Share from '../lib/parts/parts/data/kano/share.js';
import ISS from '../lib/parts/parts/data/space/iss.js';
import Weather from '../lib/parts/parts/data/weather/weather.js';

const PartTypes = [UI, Data, Hardware];
const Parts = [
    Box,
    Button,
    Clock,
    MapPart,
    Microphone,
    Mouse,
    Oscillator,
    ScrollingText,
    Slider,
    Speaker,
    Sticker,
    Synth,
    Terminal,
    TextInput,
    Text,
    RSS,
    Sports,
    Share,
    ISS,
    Weather,
];

const COLOR = '#82C23D';
const definition = {
    id: 'normal',
    name: 'Draw',
    colour: COLOR,
    defaultSource: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="part_event" x="60" y="120" id="default_part_event_id"><field name="EVENT">global.start</field></block></xml>',
    allowBackground: true,
    workspace: {
        viewport: {
            width: 512,
            height: 384,
        },
        component: 'kano-workspace-normal',
    },
    sharing: {},
    parts: Parts,
    partTypes: PartTypes,
};

const categories = [];
let blocks = [];

blocks = blocks.concat(general);

blocks.push({
    block: part => ({
        id: 'clear',
        message0: `${part.name}: clear drawing`,
        previousStatement: null,
        nextStatement: null,
    }),
    javascript: part => function (block) {
        return `devices.get('${part.id}').reset();`;
    },
});

blocks.push({
    block: part => ({
        id: 'set_transparency',
        message0: `${part.name}: set transparency to %1`,
        args0: [{
            type: 'input_value',
            name: 'ALPHA',
            check: 'Number',
        }],
        previousStatement: null,
        nextStatement: null,
        shadow: {
            ALPHA: '<shadow type="math_number"><field name="NUM">100</field></shadow>',
        },
    }),
    javascript: part => function (block) {
        const alpha = Blockly.JavaScript.valueToCode(block, 'ALPHA');
        return `devices.get('${part.id}').setTransparency(${alpha});`;
    },
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
