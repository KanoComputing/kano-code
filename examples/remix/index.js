import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import * as challenge from '../../challenge.js';
import '../../remix/blockly.contribution.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor({ sourceType: 'blockly' });
        const remix = challenge.createRemix(editor, {
            title: 'This is a remix thingy, enagage with it please',
            app: { source: '<xml><block x="200" y="300" id="block1" type="app_onStart"><value name="CALLBACK"><block type="draw_set_background_color" id="block2"><value name="COLOR"><shadow type="colour_picker" id="block3"></shadow></value></block></value></block></xml>' },
            suggestions: [{
                title: 'First block thing haha',
                target: 'block#block1',
                content: 'Hello. Do somethig here? Maybe?'
            }, {
                title: 'Other block yeah?',
                target: 'block#block3>input#COLOUR',
                content: 'Hello. Do somethig here? Maybe?'
            }],
        });
        editor.inject(document.body);

        editor.onDidInject(() => {
            remix.start();
        });
    });
