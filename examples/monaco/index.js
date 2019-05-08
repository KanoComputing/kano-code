import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import * as APIs from '../../toolbox.js';
import '../../source-editor/monaco.contribution.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor({ sourceType: 'monaco' });

        editor.inject(document.body);
    });
