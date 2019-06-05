import * as i18n from '../../i18n.js';

i18n.load('fr-FR', { blockly: true, kanoCodePath: '/' })
    .then(() => import('../../index.js'))
    .then((code) => {
        const editor = new code.Editor();
        editor.inject(document.body);
    });
