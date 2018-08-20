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
    javascript: () => function (block) {
        return `ctx.reset();\n`;
    },
});



blocks = blocks.concat(setters);
blocks = blocks.concat(space);
blocks = blocks.concat(paths);
blocks = blocks.concat(shapes);

const categoryBlocks = blocks.map((definition) => {
    if (typeof definition === 'string') {
        return {
            id: definition,
            colour: COLOR,
        };
    }
    const block = definition.block({
        id: 'draw'
    });
    block.colour = COLOR;
    return {
        id: block.id,
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

export const DrawToolbox = {
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
            if (!block.doNotRegister) {
                Blockly.Blocks[block.id] = {
                    init() {
                        this.jsonInit(block);
                    },
                };
                Blockly.Blocks[block.id].customColor = block.colour;
            }
            Blockly.JavaScript[block.id] = definition.javascript(DrawToolbox.category);
        });
    },
    category,
    defaults: {},
};
