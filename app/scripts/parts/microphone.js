let microphone;

export default microphone = {
    partType: 'hardware',
    type: 'microphone',
    label: 'Mic',
    component: 'kano-part-microphone',
    image: '/assets/part/microphone.svg',
    colour: '#FFB347',
    blocks: [{
        block: () => {
            return {
                id: 'get_volume',
                message0: 'Microphone: %1',
                args0: [{
                    type: 'field_dropdown',
                    name: 'TYPE',
                    options: [['volume', 'volume'], ['pitch', 'pitch']]
                }],
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let type = block.getFieldValue('TYPE'),
                    code = `devices.get('${part.id}').get${type}()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let type = block.getFieldValue('TYPE'),
                    code = `devices.get('${part.id}').get${type}()`;
                return [code];
            };
        }
    }, {
        block: () => {
            return {
                id: 'threshold',
                message0: 'Microphone: when volume goes %1 %2',
                args0: [{
                    type: 'field_dropdown',
                    name: 'OVER',
                    options: [['over', 'true'], ['under', 'false']]
                },{
                    type: 'input_value',
                    name: 'VALUE',
                    check: 'Number'
                }],
                message1: '%1',
                args1: [{
                    type: 'input_statement',
                    name: 'DO'
                }],
                previousStatement: true,
                nextStatement: true,
                shadow: {
                    'VALUE': '<shadow type="math_number"><field name="NUM">70</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let over = block.getFieldValue('OVER'),
                    value = Blockly.JavaScript.valueToCode(block, 'VALUE') || 70,
                    statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                    code = `devices.get('${part.id}').onVolumeThreshold(${value}, ${over}, function (){\n${statement}});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let over = block.getFieldValue('OVER'),
                    value = Blockly.Pseudo.valueToCode(block, 'VALUE') || 70,
                    statement = Blockly.Pseudo.statementToCode(block, 'DO'),
                    code = `devices.get('${part.id}').onVolumeThreshold(${value}, ${over}, function (){\n${statement}});\n`;
                return code;
            };
        }
    }]
};
