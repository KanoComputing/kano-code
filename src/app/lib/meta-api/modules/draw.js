import general from '../../parts/parts/canvas/blocks/general.js';
import paths from '../../parts/parts/canvas/blocks/paths.js';
import setters from '../../parts/parts/canvas/blocks/setters.js';
import shapes from '../../parts/parts/canvas/blocks/shapes.js';
import space from '../../parts/parts/canvas/blocks/space.js';

const COLOR = '#82C23D';
let blocks = [];

blocks = blocks.concat(general);

blocks.push({
    block: part => ({
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
    id: 'draw',
    typeScriptDefinition: `
        declare namespace draw {}
    `,
    register(Blockly) {
        const definitions = [];
        blocks.forEach((definition) => {
            if (typeof definition === 'object') {
                definitions.push(definition);
            }
        });
        definitions.forEach((definition) => {
            const block = definition.block(DrawToolbox.category);
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
            Blockly.JavaScript[id] = definition.javascript(DrawToolbox.category);
        });
    },
    category,
    defaults: {},
};

// Alias
export const DrawToolbox = DrawAPI;

export default DrawAPI;
