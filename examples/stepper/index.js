import * as creator from '../../creator.js';
import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import '../../source-editor/blockly/stepper.contribution.js';

const lang = i18n.getLang();

const app = {"source":"<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"app_onStart\" id=\"default_app_onStart\" x=\"118\" y=\"91\"><field name=\"FLASH\"></field><statement name=\"CALLBACK\"><block type=\"button_background_set\" id=\"bpN^4*Dg-KXuv,l*vOxD\"><value name=\"BACKGROUND\"><shadow type=\"colour_picker\" id=\"Nm8-O4aePXTld$G%G2Tr\"><field name=\"COLOUR\">#01579B</field></shadow></value></block></statement></block><block type=\"button_onClick\" id=\"Dhl_@,ICJMrobV3oBJWR\" x=\"117\" y=\"222\"><field name=\"FLASH\"></field></block></xml>","code":"app.onStart(function() {\n  button.background = '#01579B';\n\n});\n\nbutton.onClick(function() {\n\n});\n","parts":[{"type":"button","id":"button","name":"Button"}]};
const challengeData = {
    version: '2',
    defaultApp: JSON.stringify(app),
    steps: [{
        banner: {
            text: 'This is the button part ${part#button>toolbox} and this banner can have a lot of text, the overflow should be just fine',
            nextButton: true,
        },
    }, {
        banner: 'Oopen the ${toolbox#math} thing',
        beacon: 'toolbox#math:100,50',
        validation: {
            blockly: {
                'open-flyout': 'toolbox#math',
            },
        },
    }, {
        beacon: 'toolbox#math>flyout-block.math_arithmetic',
        validation: {
            blockly: {
                create: {
                    type: 'toolbox#math>flyout-block.math_arithmetic',
                    alias: 'math',
                },
            },
        },
    }, {
        beacon: 'alias#math>input#OP',
        banner: 'Change the value in the drop',
        validation: {
            blockly: {
                value: {
                    target: 'alias#math>input#OP',
                    value: 'MINUS'
                },
            },
        },
    }, {
        banner: 'Some markdown syntax ${toolbox#color}',
        beacon: 'toolbox#draw:100,50',
        tooltips: [{
            target: 'toolbox#draw',
            text: 'Here ${toolbox#draw} 🎂',
            position: 'right'
        }],
        validation: {
            blockly: {
                'open-flyout': 'toolbox#draw',
            },
        },
    }, {
        beacon: 'toolbox#draw>flyout-block.draw_set_background_color',
        validation: {
            blockly: {
                create: {
                    type: 'toolbox#draw>flyout-block.draw_set_background_color',
                    alias: 'set_back',
                },
            },
        },
    }, {
        beacon: 'part#button>block.onClick',
        tooltips: [{
            target: 'part#button>block.onClick',
            text: 'Jello 🤷‍♀️',
            position: 'right'
        }],
        phantom_block: 'part#button>block.onClick>input#CALLBACK',
        validation: {
            blockly: {
                connect: {
                    parent: 'part#button>block.onClick>input#CALLBACK',
                    target: 'alias#set_back',
                },
            },
        },
    }, {
        beacon: 'alias#set_back>input#COLOR',
        banner: 'Change the color there',
        validation: {
            blockly: {
                value: {
                    target: 'alias#set_back>input#COLOR>shadow>input#COLOUR'
                },
            },
        },
    }],
};

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        fetch('/assets/stories/locales/en-US/hoc_01/steps.json')
            .then(r => r.json())
            .then(c => {
                const editor = new code.Editor();

                editor.onDidInject(() => {
                    const stepper = creator.createStepper(editor, challengeData);
                    stepper.stepTo(7);
                });
        
                editor.inject(document.body);
            });
    });
