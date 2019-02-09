import { general } from './blocks/general.js';
import { paths } from './blocks/paths.js';
import { setters } from './blocks/setters.js';
import { shapes } from './blocks/shapes.js';
import { space } from './blocks/space.js';
import { IEditor } from '../../part/editor.js';
import { DrawModule } from './draw.js';

const COLOR = '#82C23D';
let blocks : any[] = [];

blocks = blocks.concat(general);

blocks.push({
    block: (part : any) => ({
        id: 'clear',
        message0: `${part.name}: clear drawing`,
        previousStatement: null,
        nextStatement: null,
    }),
    javascript: () => function javascript() {
        return 'ctx.reset();\n';
    },
});


blocks = blocks.concat(setters);
blocks = blocks.concat(space);
blocks = blocks.concat(paths);
blocks = blocks.concat(shapes);

const categoryBlocks = blocks.map((definition) => {
    if (typeof definition === 'string') {
        return {
            id: `draw_${definition}`,
            colour: COLOR,
        };
    }
    const block = definition.block({
        id: 'draw',
    });
    block.colour = COLOR;
    return {
        id: `draw_${block.id}`,
        colour: block.colour,
        shadow: block.shadow,
    };
});
const category = {
    name: 'Draw',
    id: 'draw',
    colour: COLOR,
    blocks: categoryBlocks,
};

export const DrawAPI = {
    type: 'blockly',
    id: DrawModule.id,
    typeScriptDefinition: `
        declare namespace draw {}
    `,
    register(Blockly : Blockly) {
        const definitions : any[] = [];
        blocks.forEach((definition) => {
            if (typeof definition === 'object') {
                definitions.push(definition);
            }
        });
        definitions.forEach((definition) => {
            const block = definition.block(DrawAPI.category);
            block.colour = COLOR;
            const id = `draw_${block.id}`;
            if (!block.doNotRegister) {
                Blockly.Blocks[id] = {
                    init() {
                        this.jsonInit(block);
                    },
                };
                Blockly.Blocks[id].customColor = block.colour;
            }
            Blockly.JavaScript[id] = definition.javascript(DrawAPI.category);
        });
    },
    category,
    defaults: {},
};

export default DrawAPI;
