import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import * as creator from '../../creator.js';
import '../../source-editor/blockly/creator.contribution.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor({ sourceType: 'blockly' });
        const cr = creator.create(editor);

        editor.inject(document.body);
    });
