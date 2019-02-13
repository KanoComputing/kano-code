import { Challenge } from '../../challenge.js';
import * as code from '../../index.js';
import * as APIs from '../../toolbox.js';
import * as i18n from '../../i18n.js';
import * as Modules from '../../modules.js';
import * as Parts from '../../dist/app/lib/parts/parts/index.js';
import * as PartAPIs from '../../dist/app/lib/parts/parts/api.js';


class OutputProfile extends code.OutputProfile {
    get modules() {
        return Object.values(Modules);
    }
    get parts() {
        return Object.values(Parts);
    }
}

class EditorProfile extends code.EditorProfile {
    get parts() {
        return Object.values(PartAPIs);
    }
    get toolbox() {
        return Object.values(APIs);
    }
    get outputProfile() {
        return new OutputProfile();
    }
}

const lang = i18n.getLang();

const app = {"source":"<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"app_onStart\" id=\"default_app_onStart\" x=\"118\" y=\"91\"><field name=\"FLASH\"></field><statement name=\"CALLBACK\"><block type=\"set_button_label\" id=\"[a;ncelj8}iL`cD[w?(b\"><value name=\"LABEL\"><shadow type=\"text\" id=\"fy6tFa1d;7A|y.{6oBT$\"><field name=\"TEXT\">Challenge 1</field></shadow></value></block></statement></block><block type=\"button_onClick\" id=\"inmW{Pq9h87UV=%EVAVj\" x=\"117\" y=\"192\"><field name=\"FLASH\"></field></block></xml>","code":"app.onStart(function() {\n  button.label = 'Challenge 1';\n\n});\n\nbutton.onClick(function() {\n\n});\n","parts":[{"type":"button","id":"button","name":"Button"}]};

const challengeData = {
    defaultApp: JSON.stringify(app),
    steps: [{
        banner: 'Welcome to your first challenge',
        beacon: 'default-part#button>toolbox',
        validation: {
            blockly: {
                'open-flyout': 'default-part#button',
            },
        },
    }, {
        banner: 'Here is a beacon',
        beacon: 'default-part#button>toolbox>block#onClick',
    }, {
        banner: 'Here is a beacon',
        beacon: 'default-block#default_app_onStart',
    }],
};

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();

        const challenge = new Challenge(editor, challengeData);

        editor.registerProfile(new EditorProfile());

        editor.inject(document.body);

        setTimeout(() => {
            challenge.start();
        });

    });
