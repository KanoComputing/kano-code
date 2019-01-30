import * as code from '../../dist/index.js';
import { Joy } from './joy.js';

// Output: Creates the canvas, render on refresh
class JoyOutputViewProvider extends code.OutputViewProvider {
    onInstall(output) {
        this.output = output;
        this._root = document.createElement('canvas');
        this._root.style.background = '#f9f9f9';
        this._root.style.maxWidth = '100%';
        this._root.style.maxHeight = '100%';
        this._root.width = 500;
        this._root.height = 500;

        this.step = 10;
    }
    get root() {
        return this._root;
    }
    start() {
        const ctx = this._root.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        setTimeout(() => {
            Joy.render(this._root, this.step);
        });
    }
}

// Workspace: Just hosts the output
class JoyWorkspaceViewProvider extends code.WorkspaceViewProvider {
    onInstall(editor) {
        this.editor = editor;
        this._root = document.createElement('div');
        this._root.style.textAlign = 'center';
    }
    get root() {
        return this._root;
    }
    get outputViewRoot() {
        return this.root;
    }
}

// Module: Defines the Runner API
class JoyModule extends code.AppModule {
    static get id() {
        return 'joy';
    }
    constructor(output) {
        super(output);
        this.addMethod('setStep', '_setStep');
    }
    _setStep(s) {
        const { outputView } = this.output;
        outputView.step = Math.max(2, s);
    }
}

// OutputProfile: Loads OutputView and modules together
class JoyOutputProfile extends code.OutputProfile {
    constructor() {
        super();
        this._outputViewProvider = new JoyOutputViewProvider();
    }
    get id() { return 'joy'; }
    get outputViewProvider() {
        return this._outputViewProvider;
    }
    get modules() {
        return [JoyModule];
    }
}

code.Player.registerProfile(new JoyOutputProfile());

// Toolbox: Defines coding API available for users
const JoyToolbox = {
    type: 'module',
    name: 'joy',
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

// EditorProfile: Loads WorkspaceViewProvider and Toolbox together
const workspaceProfile = {
    onInstall() {},
    outputProfile: new JoyOutputProfile(),
    workspaceViewProvider: new JoyWorkspaceViewProvider(),
    toolbox: [JoyToolbox],
};

// Create editor
const editor = new code.Editor({
    flyoutMode: true,
});

// Load profile
editor.registerProfile(workspaceProfile);

// Add to the window
editor.inject();

// Start the output
editor.output.setRunningState(true);
