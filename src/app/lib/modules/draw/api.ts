import { general } from './blocks/general.js';
import { paths } from './blocks/paths.js';
import { setters } from './blocks/setters.js';
import { shapes } from './blocks/shapes.js';
import { space } from './blocks/space.js';
import { stamp } from './blocks/stamp.js';
import { registerRepeatDrawing, registerRepeatInCircle } from './blocks/repeats.js';
import { registerAnglePicker } from './fields/angle-picker.js';
import { DrawModule } from './draw.js';
import { _ } from '../../i18n/index.js';
import Editor from '../../editor/editor.js';

const COLOR = '#82C23D';
let blocks : any[] = [];

blocks = blocks.concat(general);

blocks.push({
    block: (part : any) => ({
        id: 'clear',
        message0: `${part.name}: ${_('DRAW_CLEAR', 'clear drawing')}`,
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
blocks = blocks.concat(stamp);

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

categoryBlocks.push({
    id: 'draw_repeat_drawing',
    colour: COLOR,
});
categoryBlocks.push({
    id: 'draw_repeat_in_circle',
    colour: COLOR,
});
categoryBlocks.push({
    id: 'stamp_random',
    colour: COLOR,
});

const category = {
    name: _('MODULE_DRAW_NAME', 'Draw'),
    id: 'draw',
    colour: COLOR,
    blocks: categoryBlocks,
};

export function DrawAPI (editor: Editor) {
    const stickers = editor.output.resources.get('stickers');
    return {
        type: 'blockly',
        id: DrawModule.id,
        name: DrawModule.id,
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
                const block = definition.block(category);
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
                Blockly.JavaScript[id] = definition.javascript(category);
            });
            registerRepeatDrawing(Blockly, COLOR);
            registerRepeatInCircle(Blockly, COLOR);
            registerAnglePicker(Blockly);
        },
        category,
        defaults: {
            draw_set_background_color: {
                COLOR: '#ffffff',
            },
            draw_set_transparency: {
                ALPHA: 100,
            },
            draw_line_to: {
                X: 5,
                Y: 5,
            },
            draw_line: {
                X: 5,
                Y: 5,
            },
            draw_color: {
                COLOR: '#000',
            },
            draw_stroke: {
                COLOR: '#000',
                SIZE: 1,
            },
            draw_circle: {
                RADIUS: 5,
            },
            draw_ellipse: {
                RADIUSX: 5,
                RADIUSY: 5,
            },
            draw_square: {
                SIZE: 5,
            },
            draw_rectangle: {
                WIDTH: 5,
                HEIGHT: 5,
            },
            draw_arc: {
                RADIUS: 5,
                START: 0,
                END: 1,
                CLOSE: true,
            },
            draw_move_to: {
                X: 5,
                Y: 5,
            },
            draw_move: {
                X: 5,
                Y: 5,
            },
            draw_repeat_drawing: {
                REPEATS: 6,
                ROTATION: {
                    shadow: `<shadow type="angle"><field name="VALUE">60</field></shadow>`
                },
                MOVEMENTX: 0,
                MOVEMENTY: 0,
            },
            draw_repeat_in_circle: {
                REPEATS: 6,
            },
            draw_stamp: {
                STICKER: {
                    shadow: `<shadow type="stamp_getImage"><field name="STICKER">${stickers ? stickers.default : ''}</field></shadow>`
                },
                SIZE: 100,
                ROTATION: {
                    shadow: `<shadow type="angle"><field name="VALUE">0</field></shadow>`
                }
            }
        },
    }
};

export default DrawAPI;
