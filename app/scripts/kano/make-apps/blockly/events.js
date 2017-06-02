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
                            options: []
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

    };
    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_EVENTS,
        id: 'events',
        colour: COLOR,
        blocks: ['part_event']
    });

    Kano.MakeApps.Blockly.setLookupString('part_event', 'when(event, action)');

    Kano.MakeApps.Blockly.addModule('events', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
