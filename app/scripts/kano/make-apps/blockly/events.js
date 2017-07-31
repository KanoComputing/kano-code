/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOR = '#5fc9f3';

    let register = (Blockly) => {

        // Create a block shell of the part_event if not there yet
        if (!Blockly.Blocks.part_event) {
            Blockly.Blocks.part_event = {
                init: function () {
                    let json = {
                        id: 'part_event',
                        colour: COLOR,
                        message0: Blockly.Msg.GLOBAL_EVENT,
                        args0: [{
                            type: "field_dropdown",
                            name: "EVENT",
                            options: [['', '']]
                        }],
                        message1: '%1',
                        args1: [{
                            type: "input_statement",
                            name: "DO"
                        }]
                    };
                    this.jsonInit(json);
                }
            };
        }

        Blockly.JavaScript.part_event = (block) => {
            let ev = block.getFieldValue('EVENT'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                pieces = ev.split('.'),
                emitter = pieces[0],
                eventId = pieces[1],
                code = `devices.get('${emitter}')`;
            if (emitter === 'global') {
                code = 'global';
            }
            code += `.when('${eventId}', function () {\n${statement}});\n`;
            return code;
        };

        Blockly.Pseudo.part_event = (block) => {
            let ev = block.getFieldValue('EVENT'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                pieces = ev.split('.'),
                emitter = pieces[0],
                eventId = pieces[1],
                code = `devices.get('${emitter}')`;
            if (emitter === 'global') {
                code = 'global';
            }
            code += `.when('${eventId}', function () {\n${statement}});\n`;
            return code;
        };

        // Create a block shell of the collision event if not there yet
        if (!Blockly.Blocks.collision_event) {
            Blockly.Blocks.collision_event = {
                init: function () {
                    Blockly.Blocks.collision_event.applyCollisionFields(Blockly.Msg.WHEN, this);

                    this.appendStatementInput('DO');

                    this.setColour(COLOR);
                },
                getFirstPartOptions: function () {
                    let parts = Blockly.Blocks.collision_event.getParts() || [],
                        options = parts.map(this.formatPartOption);

                    if (!options.length) {
                        options.push(['No available part', '']);
                    }

                    return options;
                },
                getSecondPartOptions: function () {
                    let parts = Blockly.Blocks.collision_event.getParts() || [],
                        options = parts.filter(part => {
                            return `parts.get('${part.id}')` !== this.getFieldValue('PART1');
                        }).map(this.formatPartOption);

                    // The @ here is to make sure no part id will collide with this name
                    options.push(['Top Edge', "'@top-edge'"]);
                    options.push(['Right Edge', "'@right-edge'"]);
                    options.push(['Bottom Edge', "'@bottom-edge'"]);
                    options.push(['Left Edge', "'@left-edge'"]);

                    return options;
                },
                formatPartOption (part) {
                    return [part.name, `parts.get('${part.id}')`];
                }
            };
            Blockly.Blocks.collision_event.getParts = () => {
                return Blockly.Blocks.collision_event._compatibleParts;
            }
            Blockly.Blocks.collision_event.setParts = (parts) => {
                Blockly.Blocks.collision_event._compatibleParts = parts.filter(part => {
                    return part.collidable;
                });
            }
            Blockly.Blocks.collision_event.applyCollisionFields = (prefix, target) => {
                let firstDropdown, secondDropdown, input;

                firstDropdown = new Blockly.FieldDropdown(() => target.getFirstPartOptions(), function (option) {
                    if (target.getFieldValue('PART2') === option) {
                        let options = target.getField('PART2').getOptions();
                        target.setFieldValue(options[0][1], 'PART2');
                    }
                });

                // Apply the field right away to let know the second dropdown the default selection
                input = target.appendDummyInput()
                    .appendField(prefix)
                    .appendField(firstDropdown, 'PART1');

                secondDropdown = new Blockly.FieldDropdown(() => target.getSecondPartOptions());

                input.appendField(Blockly.Msg.COLLIDES_WITH)
                    .appendField(secondDropdown, 'PART2');
            };
        }

        Blockly.JavaScript.collision_event = (block) => {
            let part1Id = block.getFieldValue('PART1'),
                part2Id = block.getFieldValue('PART2'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                code = `parts.whenCollisionBetween(${part1Id ? part1Id : null}, ${part2Id}, function () {\n${statement}});\n`;
            return code;
        };

        Blockly.Pseudo.collision_event = (block) => {
            let part1Id = block.getFieldValue('PART1'),
                part2Id = block.getFieldValue('PART2'),
                statement = Blockly.Pseudo.statementToCode(block, 'DO'),
                code = `parts.whenCollisionBetween(${part1Id ? part1Id : null}, ${part2Id}, function () {\n${statement}});\n`;
            return code;
        };

    };
    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_EVENTS,
        id: 'events',
        colour: COLOR,
        blocks: [
            'part_event',
            'collision_event'
        ]
    });

    Kano.MakeApps.Blockly.setLookupString('part_event', 'when(event, action)');

    Kano.MakeApps.Blockly.addModule('events', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
