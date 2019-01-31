import * as code from '../../index.js';
import * as APIs from '../../toolbox.js';
import * as i18n from '../../i18n.js';
import * as Modules from '../../modules.js';

const Shapes = {
    type: 'module',
    // Hex color for the theme of the API
    color: '#355C7D',
    // This name is not a displayed named, but the actual variable name for the module.
    // It will be used to generate the JavaScript code
    name: 'shapes',
    // This is the displayed name for the toolbox
    verbose: 'Shapes',
    // List of available symbols in that module
    symbols: [{
        type: 'function',
        name: 'heart',
        verbose: 'Draw a heart',
        parameters: [{
            name: 'color',
            verbose: '',
            returnValue: 'Color',
            default: '#F67280',
        }],
    }],
};

class OutputProfile extends code.OutputProfile {}

class EditorProfile extends code.EditorProfile {
    get toolbox() {
        return Object.values(APIs).concat([Shapes]);
    }
    get outputProfile() {
        return new OutputProfile();
    }
}

const lang = i18n.getLang();

// Load Kano Code locales and elements
Promise.all([
    i18n.load(`/locale/editor/${lang}.json`),
    i18n.loadBlocklyMsg(`/locale/blockly/${lang}.json`),
    i18n.loadBlocklyMsg('/node_modules/@kano/kwc-blockly/blockly_built/msg/json/en.json'),
    i18n.loadBlocklyMsg('/node_modules/@kano/kwc-blockly/blockly_built/msg/json/constants.json'),
]).then(() => {
    const editor = new code.Editor();

    editor.registerProfile(new EditorProfile());

    editor.inject(document.body);
});

