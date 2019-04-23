import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import { BlocklyCreator } from '../../dist/app/lib/creator/blockly.js';


const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();
        const creator = new BlocklyCreator(editor);

        editor.onDidInject(() => {
            creator.ui.inject(document.body);
        });

        editor.inject(document.body);
    });
