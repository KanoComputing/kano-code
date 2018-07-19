
const values = {
    get_time: {
        FIELD: 'year',
    },
    text: {
        TEXT: '',
    },
    stroke: {
        SIZE: 1,
    },
    line_to: {
        X: 5,
        Y: 5,
    },
    line: {
        X: 5,
        Y: 5,
    },
    move_to: {
        X: 5,
        Y: 5,
    },
    move: {
        X: 5,
        Y: 5,
    },
    circle: {
        RADIUS: 5,
    },
    ellipse: {
        RADIUSX: 5,
        RADIUSY: 5,
    },
    square: {
        SIZE: 5,
    },
    rectangle: {
        WIDTH: 5,
        HEIGHT: 5,
    },
    arc: {
        RADIUS: 5,
        START: 0,
        END: 1,
        CLOSE: 'TRUE',
    },
    polygon: {
        CLOSE: 'TRUE',
    },
    threshold: {
        OVER: 'true',
        VALUE: 70,
    },
    light_x_y: {
        X: 0,
        Y: 0,
    },
    ui_show_hide: {
        VISIBILITY: 'show',
    },
    light_show_text: {
        COLOR: '#000000',
        BACKGROUND_COLOR: '#ffffff',
    },
    light_scroll_text: {
        COLOR: '#000000',
        BACKGROUND_COLOR: '#ffffff',
        SPEED: 50,
    },
    set_x: {
        X: 0,
    },
    set_y: {
        Y: 0,
    },
    set_width: {
        WIDTH: 0,
    },
    set_height: {
        HEIGHT: 0,
    },
    set_radius: {
        RADIUS: 0,
    },
    animation_set_speed: {
        SPEED: 15,
    },
    animation_go_to_frame: {
        FRAME: 0,
    },
    animation_display_set_animation: {
        ANIMATION: 'smiley',
    },
    animation_display_go_to_frame: {
        FRAME: 0,
    },
    picture_list_set_speed: {
        SPEED: 15,
    },
    math_min_max: {
        MINMAX: 'min',
    },
    ledring_flash: {
        COLOR: '#ffffff',
        LENGTH: 200,
    },
};

class Defaults {
    constructor() {
        this.categoryMap = new Map();
        this.shadowMap = new Map();
        this.labels = {
            category: {},
        };
        this.values = Object.assign({}, values);
    }
    getShadowForBlock(type, inputs) {
        const blockValues = this.values[type];
        const shadow = {};
        if (typeof blockValues === 'undefined') {
            return null;
        }
        inputs.forEach((input) => {
            switch (typeof blockValues[input]) {
            case 'number': {
                shadow[input] = `<shadow type="math_number"><field name="NUM">${blockValues[input]}</field></shadow>`;
                break;
            }
            case 'string': {
                // Check if it is a color
                if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(blockValues[input])) {
                    shadow[input] = `<shadow type="colour_picker"><field name="COLOUR">${blockValues[input]}</field></shadow>`;
                }
                break;
            }
            case 'object': {
                if (blockValues[input].shadow) {
                    shadow[input] = blockValues[input].shadow;
                }
                break;
            }
            default: {
                break;
            }
            }
        });
        return shadow;
    }
    createCategory(opts) {
        let shadow;
        const blocks = opts.blocks.map((block) => {
            shadow = block.shadow;
            if (typeof block === 'string') {
                // Map the block id to its category
                this.categoryMap.set(block, opts.id);
                return { id: block };
            }
            // Map the block id to its category
            this.categoryMap.set(block.id, opts.id);
            if (block.defaults) {
                shadow = this.getShadowForBlock(block.id, block.defaults);
            }
            this.shadowMap.set(block.id, shadow);
            return { id: block.id, shadow };
        });
        this.labels.category[opts.id] = opts.name;
        return {
            name: opts.name,
            id: opts.id,
            colour: opts.colour,
            blocks,
            order: opts.order,
        };
    }
    define(blockId, defaults) {
        this.values[blockId] = defaults;
    }
    getValues() {
        return this.values;
    }
}

export default Defaults;
