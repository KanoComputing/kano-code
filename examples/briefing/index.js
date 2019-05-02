import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import * as challenge from '../../challenge.js';
import '../../briefing/blockly.contribution.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor({ sourceType: 'blockly' });
        const briefing = challenge.createBriefing(editor, {
            id: '001_brief',
            instruction: 'Hello people, hahahahahahaha HAHAHAHAHAHAHAAHAHAH Lol',
            samples: [{
                img: 'https://s3-eu-west-1.amazonaws.com/world.kano.me/share-items/covers/5cca3b697215c817bae07b55.gif',
                description: 'Someone did this and I hate it!'
            }, {
                img: 'https://s3-eu-west-1.amazonaws.com/world.kano.me/share-items/covers/5cc9612132dd0f1555fff373.gif',
                description: 'Bow to the creation king!!!'
            }],
        });
        editor.inject(document.body);

        editor.onDidInject(() => {
            briefing.start();
        });
    });
