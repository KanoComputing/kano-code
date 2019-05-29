import * as i18n from '../../i18n.js';

i18n.addMessage('ARTBOARD', 'Graphiques');
i18n.addMessage('CODE_DISPLAY', 'Code');
i18n.addMessage('ADD_PARTS_BUTTON', 'Ajouter un objet');
i18n.addMessage('ADD_PARTS_HEADING', 'Ajoute un objet');
i18n.addMessage('DELETE_PART_ARE_YOU_SURE', 'Êtes vous sûr?');
i18n.addMessage('DELETE_PART_ABOUT_TO_DELETE', 'Vous êtes sûr le point de supprimer l\'objet');
i18n.addMessage('CONFIRM', 'Confirmer');
i18n.addMessage('CANCEL', 'Annuler');

i18n.addMessage('PART_BUTTON_LABEL', 'Boutton');
i18n.addMessage('BUTTON_LABEL', 'texte');
i18n.addMessage('BUTTON_LABEL_DEFAULT_VALUE', 'Clique-moi!');

window.i = i18n;

i18n.load('fr-FR', { blockly: true, kanoCodePath: '/' })
    .then(() => import('../../index.js'))
    .then((code) => {
        const editor = new code.Editor();
        editor.inject(document.body);
    });
