/* globals Blockly */
let button;

export default button = {
    partType: 'ui',
    type: 'slider',
    label: 'Slider',
    image: '/assets/part/slider.svg',
    component: 'kano-part-slider',
    customizable: {
        properties: [{
            key: 'min',
            type: 'range',
            label: 'Min'
        },{
            key: 'max',
            type: 'range',
            label: 'Max'
        }],
        style: []
    },
    userProperties: {
        min: 0,
        max: 100
    },
    events: [{
        label: 'changed',
        id: 'update'
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'connect',
                message0: `${ui.name}: connect to %1`,
                args0: [{
                    type: "input_value",
                    name: "TARGET"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let target = Blockly.JavaScript.valueToCode(block, 'TARGET');
                return `devices.get('${ui.id}').connectTo(${target});\n`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let target = Blockly.JavaScript.valueToCode(block, 'TARGET');
                return `devices.get('${ui.id}').connectTo(${target});\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'get_value',
                message0: `${ui.name}: value`,
                output: 'Number'
            };
        },
        javascript: (ui) => {
            return function (block) {
                return [`devices.get('${ui.id}').getValue()`];
            };
        },
        pseudo: (ui) => {
            return function (block) {
                return [`devices.get('${ui.id}').getValue()`];
            };
        }
    }]
};
