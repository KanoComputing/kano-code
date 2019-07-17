import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import * as creator from '../../creator.js';
import '../../source-editor/blockly/creator.contribution.js';

const lang = i18n.getLang();

const customMod = {
    type: 'module',
    name: 'coord',
    verbose: 'Coord',
    symbols: [{
        type: 'function',
        name: 'point',
        parameters: [{
            name: 'x',
            default: 0,
            returnType: Number,
        }, {
            name: 'y',
            default: 0,
            returnType: Number,
        }],
        returnType: 'Point', 
    }, {
        type: 'function',
        name: '2dMatrix',
        parameters: [{
            name: '1',
            returnType: 'Point',
            default: {},
            blockly: {
                shadow() {
                    return `<shadow type="coord_point"><value name="X"><shadow type="math_number"><value name="NUM">0</value></shadow></value><value name="Y"><shadow type="math_number"><value name="NUM">0</value></shadow></value></shadow>`;
                },
            },
        }, {
            name: '2',
            returnType: 'Point',
            default: {},
            blockly: {
                shadow() {
                    return `<shadow type="coord_point"><value name="X"><shadow type="math_number"><value name="NUM">0</value></shadow></value><value name="Y"><shadow type="math_number"><value name="NUM">0</value></shadow></value></shadow>`;
                },
            },
        }],
    }],
}

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor({ sourceType: 'blockly' });
        const cr = creator.create(editor);

        editor.toolbox.addEntry(customMod);

        editor.inject(document.body);
    });
