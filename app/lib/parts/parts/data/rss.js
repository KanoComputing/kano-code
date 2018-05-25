import { localize } from '../../../i18n/index.js';

const sources = [{
    value: 'headlines',
    label: localize('PART_DATA_RSS_SOURCE_HEADLINES'),
}, {
    value: 'world',
    label: localize('PART_DATA_RSS_SOURCE_WORLD'),
}, {
    value: 'uk',
    label: localize('PART_DATA_RSS_SOURCE_UK'),
}, {
    value: 'edu',
    label: localize('PART_DATA_RSS_SOURCE_EDUCATION'),
}, {
    value: 'sci_env',
    label: localize('PART_DATA_RSS_SOURCE_SCI_ENV'),
}, {
    value: 'tech',
    label: localize('PART_DATA_RSS_SOURCE_TECH'),
}, {
    value: 'ent_arts',
    label: localize('PART_DATA_RSS_SOURCE_ENT_ARTS'),
}];

const rss = {
    partType: 'data',
    type: 'rss',
    label: localize('PART_DATA_RSS_NAME'),
    colour: '#cddc39',
    image: '/assets/part/rss.svg',
    dataType: 'list',
    dataLength: 10,
    parameters: [{
        label: localize('PART_DATA_RSS_SOURCE_TITLE'),
        key: 'src',
        type: 'list',
        value: 'headlines',
        options: sources,
    }],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'rss.getFeed',
    dataKeys: [{
        label: localize('PART_DATA_RSS_TITLE_TITLE'),
        key: 'title',
        description: localize('PART_DATA_RSS_TITLE_DESC'),
    }],
    blocks: [{
        block: ui => ({
            id: 'rss_source',
            message0: `${ui.name}: %1`,
            output: 'String',
            args0: [{
                type: 'field_dropdown',
                name: 'FIELD',
                options: sources.map(source => [source.label, source.value]),
            }],
        }),
        javascript: () => (block) => {
            let field = block.getFieldValue('FIELD'),
                code = `'${field}'`;
            return [code];
        },
    }, {
        block: ui => ({
            id: 'set_rss_source',
            message0: `${ui.name}: ${Blockly.Msg.BLOCK_RSS_SET_SOURCE}`,
            inputsInline: false,
            args0: [{
                type: 'input_value',
                name: 'SRC',
                check: 'String',
            }],
            previousStatement: null,
            nextStatement: null,
        }),
        javascript: part => (block) => {
            let src = Blockly.JavaScript.valueToCode(block, 'SRC') || '\'headlines\'',
                code = `devices.get('${part.id}').setConfig('src', ${src});\n`;
            return code;
        },
    }],
};

export default rss;
