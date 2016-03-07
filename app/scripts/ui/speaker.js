import UI from './ui';

export default class Speaker extends UI {
    constructor () {
        super({
            type: 'speaker',
            label: 'Speaker',
            image: 'assets/ui/speaker.png',
            hue: 200
        });
        this.addBlock({
            id: 'say',
            message0: 'say %1',
            args0: [{
                type: "input_value",
                name: "TEXT"
            }],
            previousStatement: null,
            javascript: (hw) => {
                return function (block) {
                    let text = Blockly.JavaScript.valueToCode(block, 'TEXT'),
                        code = `devices.get('${hw.id}').say(${text})`;
                    return code;
                };
            },
            natural: (hw) => {
                return function (block) {
                    let text = Blockly.Natural.valueToCode(block, 'TEXT'),
                        code = `${hw.label} say ${text}`;
                    return code;
                };
            }
        });
    }
    say (text) {
        this.getElement().say(text);
    }
}
