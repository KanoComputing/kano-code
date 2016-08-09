/**
 * Defines the default values for blockly blocks inputs and fields.
 * Used to generated shadow blocks and to guess actions in tutorial generation
 */
(function (Kano) {
    var Defaults;
    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Blockly = Kano.MakeApps.Blockly || {};

    Defaults = Kano.MakeApps.Blockly.Defaults = {};

    Defaults.categoryMap = {};
    Defaults.labels = {};
    Defaults.labels.category = {};

    Defaults.getShadowForBlock = function (type, inputs) {
        var values = Defaults.values[type],
            shadow = {};
        if (!values) {
            return;
        }
        inputs.forEach(input => {
            switch (typeof values[input]) {
                case 'number': {
                    shadow[input] = `<shadow type="math_number"><field name="NUM">${values[input]}</field></shadow>`;
                    break;
                }
                case 'string': {
                    // Check if it is a colours
                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(values[input])) {
                        shadow[input] = `<shadow type="colour_picker"><field name="COLOUR">${values[input]}</field></shadow>`;
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return shadow;
    };

    Defaults.createCategory = function (opts) {
        var blocks = opts.blocks.map(block => {
            if (typeof block === 'string') {
                // Map the block id to its category
                Defaults.categoryMap[block] = opts.id;
                return {
                    id: block
                };
            }
            // Map the block id to its category
            Defaults.categoryMap[block.id] = opts.id;
            return {
                id: block.id,
                shadow: Defaults.getShadowForBlock(block.id, block.defaults)
            };
        });
        this.labels.category[opts.id] = opts.name;
        return {
            name: opts.name,
            id: opts.id,
            colour: opts.colour,
            blocks: blocks
        };
    };

    Defaults.values = {
        'colour_picker': {
            'COLOUR': '#ff0000'
        },
        'math_number': {
            'NUM': 0
        },
        'math_random': {
            'TYPE': 'integer',
            'MIN': 0,
            'MAX': 10
        },
        'variables_set': {
            'VAR': 'item'
        },
        'variables_get': {
            'VAR': 'item'
        },
        'part_event': {
            'EVENT': 'global.start'
        },
        'every_x_seconds': {
            'INTERVAL': 1,
            'UNIT': 'seconds'
        },
        'repeat_x_times': {
            'N': 10
        },
        'unary': {
            'LEFT_HAND': 'item',
            'OPERATOR': '+=',
            'RIGHT_HAND': 1
        },
        'math_arithmetic': {
            'OP': 'ADD'
        },
        'logic_compare': {
            'OP': 'EQ'
        },
        'logic_boolean': {
            'BOOL': 'TRUE'
        },
        'get_time': {
            'FIELD': 'year'
        },
        'text': {
            'TEXT': ''
        },
        'lists_getIndex': {
            'MODE': 'GET'
        },
        'lists_setIndex': {
            'MODE': 'SET'
        },
        'stroke': {
            'SIZE': 1
        },
        'line_to': {
            'X': 5,
            'Y': 5
        },
        'line': {
            'X': 5,
            'Y': 5
        },
        'move_to': {
            'X': 5,
            'Y': 5
        },
        'move': {
            'X': 5,
            'Y': 5
        },
        'circle': {
            'RADIUS': 5
        },
        'ellipse': {
            'RADIUSX': 5,
            'RADIUSY': 5
        },
        'square': {
            'SIZE': 5
        },
        'rectangle': {
            'WIDTH': 5,
            'HEIGHT': 5
        },
        'arc': {
            'RADIUS': 5,
            'START': 0,
            'END': 1,
            'CLOSE': 'TRUE'
        },
        'polygon': {
            'CLOSE': 'TRUE'
        },
        'threshold': {
            'OVER': 'true',
            'VALUE': 70
        },
        'light_x_y': {
            'X': 0,
            'Y': 0
        },
        'ui_show_hide': {
            'VISIBILITY': 'show'
        },
        'light_show_text': {
            'COLOR': '#000000',
            'BACKGROUND_COLOR': '#ffffff'
        },
        'light_scroll_text': {
            'COLOR': '#000000',
            'BACKGROUND_COLOR': '#ffffff',
            'SPEED': 50
        },
        'set_x': {
            'X': 0
        },
        'set_y': {
            'Y': 0
        },
        'set_width': {
            'WIDTH': 0
        },
        'set_height': {
            'HEIGHT': 0
        },
        'set_radius': {
            'RADIUS': 0
        },
        'animation_set_speed': {
            'SPEED': 15
        },
        'animation_go_to_frame': {
            'FRAME': 0
        },
        'animation_display_set_animation': {
            'ANIMATION': 'smiley'
        },
        'animation_display_go_to_frame': {
            'FRAME': 0
        },
        'create_color': {
            'TYPE': 'rgb'
        },
        'picture_list_set_speed': {
            'SPEED': 15
        },
        'math_min_max': {
            'MINMAX': 'min'
        }
    };

})(window.Kano = window.Kano || {});
