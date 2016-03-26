let speech;

const COLOUR = '#F29120';

export default speech = {
    name: 'Speech',
    colour: COLOUR,
    started: false,
    methods: {
        whenHeard (sentence, callback) {
            let command = {};
            command[sentence] = callback;
            annyang.addCommands(command);
            if (!speech.started) {
                speech.started = true;
                annyang.start();
            }
        }
    },
    lifecycle: {
        stop () {
            if (speech.started) {
                annyang.pause();
                speech.started = false;
            }
        }
    },
    blocks: [{
        block: {
            id: 'when_heard',
            message0: 'when %1 is heard',
            args0: [{
                type: "input_value",
                name: "SENTENCE"
            }],
            message1: 'do %1',
            args1: [{
                type: "input_statement",
                name: "DO"
            }]
        },
        javascript: (block) => {
            let sentence = Blockly.JavaScript.valueToCode(block, 'SENTENCE'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                code = `speech.whenHeard(${sentence}, function () {
                    ${statement}
                });\n`;
            return [code];
        },
        natural: (block) => {
            let sentence = Blockly.Natural.valueToCode(block, 'SENTENCE'),
                statement = Blockly.Natural.statementToCode(block, 'DO'),
                code = `When ${sentence} is heard, do ${statement}\n`;
            return [code];
        }
    }]
};
