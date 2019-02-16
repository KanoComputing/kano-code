const blockAliases : { [K : string] : any } = {};

const partBlocks : { [K : string] : any } = {
    mouse: {
        mouse_x: 'x_get',
        mouse_y: 'y_get',
    },
};

export function transformToolboxSelector(legacySelector : any) {
    if (typeof legacySelector === 'string') {
        if (legacySelector === 'normal') {
            return 'toolbox#draw';
        }
        return `toolbox#${legacySelector}`;
    } else if (typeof legacySelector.part === 'string') {
        const alias = blockAliases[legacySelector.part];
        if (alias) {
            return `alias#${legacySelector.part}>toolbox`;
        } else {
            return `part#${legacySelector.part}>toolbox`;
        }
    }
}

const legacyToolboxMap : { [K : string] : string } = {
    colour_picker: 'flyout-block.colour_picker',
    repeat_x_times: 'flyout-block.repeat_x_times',
    set_background_color: 'flyout-block.draw_set_background_color',
    set_transparency: 'flyout-block.draw_set_transparency',
    clear: 'flyout-block.draw_clear',
    color: 'flyout-block.draw_color',
    no_fill: 'flyout-block.draw_no_fill',
    stroke: 'flyout-block.draw_stroke',
    move_to: 'flyout-block.draw_move_to',
    move_to_random: 'flyout-block.draw_move_to_random',
    move: 'flyout-block.draw_move',
    line_to: 'flyout-block.draw_line_to',
    line: 'flyout-block.draw_line',
    circle: 'flyout-block.draw_circle',
    ellipse: 'flyout-block.draw_ellipse',
    square: 'flyout-block.draw_square',
    rectangle: 'flyout-block.draw_rectangle',
    arc: 'flyout-block.draw_arc',
    pixel: 'flyout-block.draw_pixel',
}

function transformLocation(location : any) {
    if (typeof location === 'string') {
        if (location.startsWith('parts-panel-')) {
            const partId = location.replace('parts-panel-', '');
            return `part.${partId}`;
        }
        return location;
    } else if (typeof location.category === 'string') {
        return transformToolboxSelector(location.category);
    } else if (typeof location.category === 'object') {
        if (typeof location.category.part === 'string') {
            const original = blockAliases[location.category.part];
            let selector;
            if (original) {
                selector = `alias#${location.category.part}>toolbox`;
            } else {
                selector = `part#${location.category.part}>toolbox`;
            }
            return selector;
        }
    } else if (typeof location.part === 'string') {
        const original = blockAliases[location.part];
        console.log(original);
    } else if (typeof location.flyout_block === 'string') {
        if (location.flyout_block.indexOf('#') !== -1) {
            let [entry, block] = location.flyout_block.split('#');
            let selector = transformToolboxSelector(entry);
            selector += `>flyout-block.${block}`;
            return selector;
        } else {
            const mappedSelector = legacyToolboxMap[location.flyout_block];
            return mappedSelector || `flyout-block.${location.flyout_block}`;
        }
    } else if (typeof location.flyout_block === 'object') {
        if (location.flyout_block.part && location.flyout_block.type) {
            let selector;
            const original = blockAliases[location.flyout_block.part];
            if (original) {
                selector = `alias#${location.flyout_block.part}`;
                const map = partBlocks[original];
                if (map) {
                    const blockName = map[location.flyout_block.type];
                    if (blockName) {
                        selector += `>flyout-block.${blockName}`;
                    }
                }
            } else {
                selector = `part#${location.flyout_block.part}`;
                selector += `>flyout-block.${location.flyout_block.type}`;
            }
            return selector;
        }
    } else if (location.block) {
        let selector;
        if (location.block.id) {
            selector = `alias#${location.block.id}`;
        } else if (location.block.rawId) {
            const id = location.block.rawId === 'default_part_event_id' ? 'default_app_onStart' : location.block.rawId;
            selector = `block#${id}`;
        }
        if (typeof location.block.shadow === 'string') {
            selector += `>input#${location.block.shadow}`;
        } else if (typeof location.block.inputName === 'string') {
            selector += `>input#${transformConnection(location, location.block.inputName)}`;
        }

        return selector;
    }
}

function transformConnection(location : any, target : string) : string|null {
    if (typeof location === 'string') {
        if (location === 'normal#set_background_color') {
            return target;
        }
        if (location === 'normal#move_to') {
            return target
        }
        if (location === 'normal#color') {
            return target;
        }
        if (location === 'repeat_x_times') {
            return target;
        }
        if (location === 'every_x_seconds') {
            return target;
        }
        if (location === 'create_color') {
            return target;
        }
    }
    if (location.block) {
        if (location.block.rawId === 'default_part_event_id') {
            if (target === 'DO') {
                return 'CALLBACK';
            }
        }
        if (location.block.id) {
            const alias = blockAliases[location.block.id];
            if (alias) {
                return transformConnection(alias, target);
            }
        }
    }
    return null;
}

function transformBeacon(data : any) {
    if (typeof data.target) {
        return `${transformLocation(data.target)}:100,50`;
    }
    return null;
}

function transformPhantomBlock(data : any) {
    if (!data.location) {
        return;
    }
    const selector = transformLocation(data.location);
    let connection = 'next';
    if (data.target) {
        connection = `input#${transformConnection(data.location, data.target)}`;
    }
    return `${selector}>${connection}`;
}

const positionMap : { [K : string] : string } = {
    right: ':100,50',
    left: ':0,50',
    top: ':50,0',
    bottom: ':50,100',
}

export function transformTooltips(step : any, tooltips : any[]) {
    if (tooltips.length > 1) {
        console.warn('Step has more than one tooltip. Will use first one and discard other');
    }
    if (!tooltips.length) {
        return tooltips;
    }
    const [tooltip] = tooltips;
    if (!tooltip.location) {
        return;
    }
    let selector;
    // Ignore some location selectors
    if (tooltip.location !== 'workspace-panel' && !step.beacon) {
        selector = transformLocation(tooltip.location);
        if (tooltip.position) {
            selector += positionMap[tooltip.position];
        }
        step.beacon = selector;
    }
    if (tooltip.text) {
        step.banner = tooltip.text;
    }
    return;
}

function transformAlias(input : string) {
    return `alias#${input}`;
}

export function transformBlocklyValidation(step: any, validation : any) {
    if (validation['open-flyout']) {
        validation['open-flyout'] = transformToolboxSelector(validation['open-flyout']);
    }
    if (validation.create) {
        if (typeof validation.create.id === 'string') {
            blockAliases[validation.create.id] = validation.create.type;
        }
        if (typeof validation.create.target === 'string') {
            const original = blockAliases[validation.create.target];
            let selector;
            if (original) {
                selector = `alias#${validation.create.target}`;
                const map = partBlocks[original];
                let blockName;
                if (map) {
                    blockName = map[validation.create.type];
                    if (blockName) {
                        selector += `>flyout-block.${blockName}`;
                    }
                } else {
                    blockName = validation.create.type;
                }
            } else {
                selector = `part#${validation.create.target}`;
                selector += `>flyout-block.${validation.create.type}`;
            }
            validation.create = {
                type: selector,
                alias: validation.create.id,
            };
        } else {
            validation.create = {
                type: transformLocation({ flyout_block: validation.create.type }),
                alias: validation.create.id,
            };
        }
    }
    if (validation.connect) {
        let parent = transformLocation({ block: validation.connect.parent });
        let target;
        if (typeof validation.connect.target === 'string') {
            target = transformAlias(validation.connect.target);
        }
        if (parent && parent.indexOf('>input') === -1) {
            parent += '>next';
        }
        let connection;
        validation.connect = {
            parent,
            target,
            connection,
        };
    }
    if (validation.value) {
        const val = validation.value.value;
        validation.value = {
            target: transformLocation({ block: validation.value.target }),
            value: val,
        };
    }
}

function transformAddPart(step : any, validation : any) {
    if (validation.id) {
        validation.alias = validation.id;
        delete validation.id;
        blockAliases[validation.alias] = validation.type;
    }
}

export function transformValidation(step: any, validation : any) {
    if (validation.blockly) {
        transformBlocklyValidation(step, validation.blockly);
    }
    if (validation['add-part']) {
        transformAddPart(step, validation['add-part']);
    }
}

export function transformStep(step : any) {
    if (step.validation) {
        transformValidation(step, step.validation);
    }
    if (step.beacon) {
        step.beacon = transformBeacon(step.beacon);
    }
    if (step.tooltips) {
        step.tooltips = transformTooltips(step, step.tooltips);
    }
    if (step.phantom_block) {
        step.phantom_block = transformPhantomBlock(step.phantom_block);
    }
    if (step.banner) {
        step.banner = transformBanner(step.banner);
    }
}
export function transformBanner(data : any) {
    if (typeof data.next_button === 'boolean') {
        data.nextButton = data.next_button;
        delete data.next_button;
    }
    return data;
}

export function transformChallenge(data : any) {
    if (data.steps) {
        data.steps.forEach((step : any) => transformStep(step));
    }
    if (!data.defaultApp) {
        data.defaultApp = JSON.stringify({"source":"<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"app_onStart\" id=\"default_app_onStart\" x=\"40\" y=\"120\"><field name=\"FLASH\"></field></block></xml>"});
    }
}