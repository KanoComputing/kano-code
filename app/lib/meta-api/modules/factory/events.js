import { localize } from '../../../i18n/index.js';

function getEventOptions(editor) {
    const { addedParts } = editor.store.getState();
    const options = [['app starts', 'global.start']];
    if (addedParts) {
        addedParts.forEach((part) => {
            part.events.forEach((ev) => {
                options.push([`${part.name} ${ev.label}`, `${part.id}.${ev.id}`]);
            });
        });
    }
    // Add events of the current mode
    if (editor.output.outputProfile.events) {
        editor.output.outputProfile.events.forEach((ev) => {
            options.push([`${this.mode.name} ${ev.label}`, `${this.mode.id}.${ev.id}`]);
        });
    }
    return options;
}

function formatPartCollisionOption(part) {
    return [part.name, `parts.get('${part.id}')`];
}

function getCollisionPartsOptions(editor) {
    const { addedParts } = editor.store.getState();
    const compatibleParts = addedParts.filter(part => part.collidable);
    const options = compatibleParts.map(formatPartCollisionOption);

    if (!options.length) {
        options.push(['No available part', '']);
    }

    return options;
}

function getCollisionWithPartsOptions(editor, part1) {
    const { addedParts } = editor.store.getState();
    const compatibleParts = addedParts.filter(part => part.collidable);
    const options = compatibleParts.filter(part => `parts.get('${part.id}')` !== part1).map(formatPartCollisionOption);

    // The @ here is to make sure no part id will collide with this name
    options.push(['Top Edge', "'@top-edge'"]);
    options.push(['Right Edge', "'@right-edge'"]);
    options.push(['Bottom Edge', "'@bottom-edge'"]);
    options.push(['Left Edge', "'@left-edge'"]);

    return options;
}

export const EventsModuleFactory = (editor) => {
    const COLOR = '#5fc9f3';
    // TODO: Add blockly option to met-api to allow custom javascript render
    return {
        type: 'module',
        name: 'global',
        verbose: localize('CATEGORY_EVENTS', 'Events'),
        color: COLOR,
        symbols: [{
            type: 'function',
            name: 'when',
            verbose: localize('BLOCK_GLOBAL_EVENT', 'When'),
            parameters: [{
                name: 'event',
                verbose: '',
                returnType: 'Enum',
                default: 'global.start',
                enum: () => getEventOptions(editor),
            }, {
                name: 'do',
                returnType: Function,
            }],
            blockly: {
                postProcess(json) {
                    delete json.previousStatement;
                    delete json.nextStatement;
                    return json;
                },
                javascript(Blockly, block) {
                    const ev = block.getFieldValue('EVENT');
                    const statement = Blockly.JavaScript.statementToCode(block, 'DO');
                    const pieces = ev.split('.');
                    const emitter = pieces[0];
                    const eventId = pieces[1];
                    let code = `devices.get('${emitter}')`;
                    if (emitter === 'global') {
                        code = 'global';
                    }
                    code += `.when('${eventId}', function () {\n${statement}});\n`;
                    return code;
                },
            },
        }, {
            type: 'function',
            name: 'whenCollisionBetween',
            verbose: localize('BLOCK_COLLISION_EVENT', 'When'),
            parameters: [{
                name: 'part1',
                verbose: '',
                returnType: 'Enum',
                blockly: {
                    customField(Blockly, block) {
                        const field = new Blockly.FieldDropdown(() => getCollisionPartsOptions(editor), ((option) => {
                            if (block.getFieldValue('PART2') === option) {
                                const options = block.getField('PART2').getOptions();
                                block.setFieldValue(options[0][1], 'PART2');
                            }
                        }));
                        return field;
                    },
                },
            }, {
                name: 'part2',
                returnType: 'Enum',
                verbose: localize('COLLIDES_WITH'),
                blockly: {
                    customField(Blockly, block) {
                        const field = new Blockly.FieldDropdown(() => getCollisionWithPartsOptions(editor, block.getFieldValue('PART1')));
                        return field;
                    },
                },
            }, {
                name: 'do',
                returnType: Function,
            }],
            blockly: {
                postProcess(json) {
                    json.inputsInline = true;
                    delete json.previousStatement;
                    delete json.nextStatement;
                    return json;
                },
                javascript(Blockly, block) {
                    const part1Id = block.getFieldValue('PART1');
                    const part2Id = block.getFieldValue('PART2');
                    const statement = Blockly.JavaScript.statementToCode(block, 'DO');
                    return `parts.whenCollisionBetween(${part1Id || null}, ${part2Id}, function () {\n${statement}});\n`;
                },
            },
        }],
    };
};

export default EventsModuleFactory;
