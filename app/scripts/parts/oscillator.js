let microphone;

export default microphone = {
    partType: 'ui',
    type: 'oscillator',
    label: 'Osc',
    component: 'kano-part-oscillator',
    image: '/assets/part/osc.svg',
    colour: '#FFB347',
    customizable: {
        properties: [{
            key: 'wave',
            label: 'Wave',
            type: 'wave'
        },{
            key: 'speed',
            label: 'Speed',
            type: 'range',
            min: 0,
            max: 100
        }, {
            key: 'delay',
            label: 'Delay',
            type: 'range',
            min: 0,
            max: 100
        }],
        style: []
    },
    userProperties: {
        wave: 'sine',
        speed: 50,
        delay: 0
    },
    showDefaultConfiguration: false,
    excludeDefaultBlocks: true,
    blocks: [{
        block: (part) => {
            return {
                id: 'osc_get_value',
                message0: `${part.name}: value`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getValue()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getValue()`;
                return [code];
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'osc_set_speed',
                message0: `${part.name}: set speed %1`,
                args0: [{
                    type: 'input_value',
                    name: 'SPEED',
                    check: 'Number'
                }],
                previousStatement: true,
                nextStatement: true
            };
        },
        javascript: (part) => {
            return (block) => {
                let speed = Blockly.JavaScript.valueToCode(block, 'SPEED') || 50;
                return `devices.get('${part.id}').setSpeed(${speed});\n`;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let speed = Blockly.Pseudo.valueToCode(block, 'SPEED') || 50;
                return `devices.get('${part.id}').setSpeed(${speed});\n`;
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'osc_get_speed',
                message0: `${part.name}: speed`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return () => {
                return [`devices.get('${part.id}').getSpeed()`];
            };
        },
        pseudo: (part) => {
            return () => {
                return [`devices.get('${part.id}').getSpeed()`];
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'osc_set_delay',
                message0: `${part.name}: set delay %1`,
                args0: [{
                    type: 'input_value',
                    name: 'DELAY',
                    check: 'Number'
                }],
                previousStatement: true,
                nextStatement: true
            };
        },
        javascript: (part) => {
            return (block) => {
                let delay = Blockly.JavaScript.valueToCode(block, 'DELAY') || 0;
                return `devices.get('${part.id}').setDelay(${delay});\n`;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let delay = Blockly.Pseudo.valueToCode(block, 'DELAY') || 0;
                return `devices.get('${part.id}').setDelay(${delay});\n`;
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'osc_get_delay',
                message0: `${part.name}: delay`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return () => {
                return [`devices.get('${part.id}').getDelay()`];
            };
        },
        pseudo: (part) => {
            return () => {
                return [`devices.get('${part.id}').getDelay()`];
            };
        }
    }]
};
