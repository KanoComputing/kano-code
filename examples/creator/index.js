import * as code from '../../index.js';
import * as i18n from '../../i18n.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor({ sourceType: 'blockly' });
        const creator = editor.sourceEditor.getCreator();

        editor.onDidInject(() => {
            creator.ui.inject(document.body);
        });

        editor.toolbox.addEntry({
            type: 'module',
            name: 'position',
            symbols: [{
                type: 'function',
                name: 'create',
                returnType: 'Position',
                parameters: [{
                    name: 'x',
                    returnType: Number,
                    default: 0,
                }, {
                    name: 'y',
                    returnType: Number,
                    default: 0,
                }]
            }, {
                type: 'function',
                name: 'fg',
                parameters: [{
                    name: 'position',
                    verbose: 'at',
                    returnType: 'Position',
                    default: {
                        x: 400,
                        y: 300,
                    },
                    blockly: {
                        shadow(value) {
                            return `<shadow type="position_create">
                                        <value name="X">
                                            <shadow type="math_number">
                                                <field name="NUM">${value.x}</field>
                                            </shadow>
                                        </value>
                                        <value name="Y">
                                            <shadow type="math_number">
                                                <field name="NUM">${value.y}</field>
                                            </shadow>
                                        </value>
                                    </shadow>`;
                        },
                    },
                }],
            }],
        });

        editor.inject(document.body);
    });
