import { localize } from '../../i18n/index.js';

const microphone = {
    partType: 'hardware',
    type: 'microphone',
    label: localize('PART_MIC_NAME'),
    component: 'kano-part-microphone',
    image: '/assets/part/microphone.svg',
    colour: '#FFB347',
    singleton: true,
    blocks: [{
        block: (part) => {
            return {
                id: 'get_volume',
                message0: `${part.name}: %1`,
                args0: [{
                    type: 'field_dropdown',
                    name: 'TYPE',
                    options: [
                        [Blockly.Msg.BLOCK_MIC_VOLUME, 'volume'],
                        [Blockly.Msg.BLOCK_MIC_PITCH, 'pitch']
                    ]
                }],
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let type = block.getFieldValue('TYPE'),
                    code = `devices.get('${part.id}').${type}`;
                return [code];
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'threshold',
                message0: `${part.name}: ${Blockly.Msg.BLOCK_MIC_WHEN_VOLUME}`,
                args0: [{
                    type: 'field_dropdown',
                    name: 'OVER',
                    options: [
                        [Blockly.Msg.BLOCK_MIC_OVER, 'true'],
                        [Blockly.Msg.BLOCK_MIC_UNDER, 'false']
                    ]
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
                    'VALUE': `<shadow type="math_number"><field name="NUM">70</field></shadow>`
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
        }
    }]
};

export default microphone;