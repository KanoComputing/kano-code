import * as i18n from '../../i18n.js';

// i18n.setDebug(true);

i18n.load('ja-jp', { blockly: true, kanoCodePath: '/' })
    .then(() => import('../../index.js'))
    .then((code) => {
        const editor = new code.Editor();
        editor.inject(document.body);
    });
