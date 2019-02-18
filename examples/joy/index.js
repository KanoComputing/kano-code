import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import { Joy } from './joy.js';

// Module: Defines the Runner API
class JoyModule extends code.AppModule {
    static get id() {
        return 'joy';
    }
    constructor(output) {
        super(output);
        this.canvas = this.output.visuals.canvas;
        this.step = 20;
        this.addMethod('setStep', '_setStep');
        this.addLifecycleStep('start', '_start');
    }
    _start() {
        this._render();
    }
    _setStep(s) {
        this.step = Math.max(2, s);
        this._render();
    }
    _render() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Joy.render(this.canvas, this.step);
    }
}

// Toolbox: Defines coding API available for users
const JoyToolbox = {
    type: 'module',
    name: 'joy',
    verbose: 'Joy',
    color: '#0d47a1',
    symbols: [{
        type: 'function',
        name: 'setStep',
        verbose: 'set step',
        parameters: [{
            name: 'step',
            verbose: '',
            returnType: Number,
            default: 10,
        }],
    }],
};

class OutputProfile extends code.DefaultOutputProfile {
    onInstall(output) {
        super.onInstall(output);
        this.modules.push(JoyModule);
    }
}
class EditorProfile extends code.DefaultEditorProfile {
    onInstall(output) {
        super.onInstall(output);
        this.toolbox.push(JoyToolbox);
        this.outputProfile = new OutputProfile();
    }
}

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        // Create editor
        const editor = new code.Editor();

        // Load profile
        editor.registerProfile(new EditorProfile());

        // Add to the window
        editor.inject();

        // Start the output
        editor.output.setRunningState(true);
    });

