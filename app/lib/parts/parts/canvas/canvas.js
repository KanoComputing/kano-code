

import general from './blocks/general.js';
import paths from './blocks/paths.js';
import setters from './blocks/setters.js';
import shapes from './blocks/shapes.js';
import space from './blocks/space.js';

let blocks = [{
    block: (ui) => {
        return {
            id: 'clear',
            message0: `${ui.name}: clear`,
            previousStatement: null,
            nextStatement: null,
        };
    },
    javascript: (ui) => {
        return function (block) {
            return `devices.get('${ui.id}').resetSession();`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            return `devices.get('${ui.id}').resetSession();`;
        };
    },
}];

blocks = blocks.concat(general);
blocks = blocks.concat(paths);
blocks = blocks.concat(setters);
blocks = blocks.concat(shapes);
blocks = blocks.concat(space);

import { localize } from '../../i18n/index.js';

const canvas = {
    partType: 'ui',
    type: 'canvas',
    label: localize('PART_CANVAS_NAME'),
    image: '/assets/part/box.svg',
    component: 'kano-part-canvas',
    colour: '#E73544',
    customizable: {
        style: ['width', 'height'],
    },
    userStyle: {
        width: '200px',
        height: '200px',
    },
    blocks,
};

export default canvas;
