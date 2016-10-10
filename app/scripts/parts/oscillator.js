let microphone;

export default microphone = {
    partType: 'ui',
    type: 'oscillator',
    label: 'Osc',
    component: 'kano-part-oscillator',
    image: '/assets/part/microphone.svg',
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
        }],
        style: []
    },
    userProperties: {
        wave: 'sine',
        speed: 50
    },
    showDefaultConfiguration: false,
    blocks: [{
        block: (part) => {
            return {
                id: 'get_value',
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
                id: 'tick',
                message0: `${part.name}: tick`,
                previousStatement: true,
                nextStatement: true
            };
        },
        javascript: (part) => {
            return (block) => {
                return `devices.get('${part.id}').tick();\n`;
            };
        },
        pseudo: (part) => {
            return (block) => {
                return `devices.get('${part.id}').tick();\n`;
            };
        }
    }]
};
