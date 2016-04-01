let label;

export default label = {
    type: 'label',
    label: 'Label',
    image: '/assets/part/text-icon.png',
    colour: '#607d8b',
    customizable: {
        style: ['color', 'font-size', 'font-weight'],
        properties: [{
            key: 'text',
            type: 'text',
            label: 'Text'
        }]
    },
    userStyle: {
        color: 'black',
        'font-size': '1em',
        'font-weight': '400'
    },
    userProperties: {
        text: 'My text'
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'set_value',
                message0: `set ${ui.name} to %1`,
                args0: [{
                    type: "input_value",
                    name: "INPUT"
                }],
                nextStatement: null,
                previousStatement: null
            }
        },
        javascript: (ui) => {
            return function (block) {
                let value = Blockly.JavaScript.valueToCode(block, 'INPUT');
                return `devices.get('${ui.id}').setValue(${value});`;
            };
        },
        natural: (ui) => {
            return function (block) {
                let value = Blockly.Natural.valueToCode(block, 'INPUT');
                return `set ${ui.name} to ${value}`;
            };
        }
    }]
};
