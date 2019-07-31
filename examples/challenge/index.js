import * as challenge from '../../challenge.js';
import * as code from '../../index.js';
import * as i18n from '../../i18n.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();

        editor.onDidInject(() => {
            fetch('/examples/challenge/ch.json')
                .then(r => r.json())
                .then((challengeData) => {
                    const ch = challenge.createChallenge(editor, challengeData);
                    ch.onDidEnd(() => {
                        console.log('Challenge completed');
                    });
                    ch.onDidRequestNextChallenge(() => {
                        console.log('User wants to leave');
                    });
                    const img = document.createElement('img');
                    img.src = '/examples/assets/sw/droid.svg'
                    ch.engine.setBannerIconProvider({
                        getDomNode() { return img; }
                    });
                    ch.engine.setBannerTitle('Step by Step');
                    ch.start();
                });
        });

        editor.inject(document.body);
    });
