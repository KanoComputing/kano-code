import * as code from '../../app/lib/index.js';
import { Spiral } from './spiral.js';
import '../../app/elements/kc-workspace-toolbar/kc-workspace-toolbar.js';

// OUTPUT CONFIGURATION

// Runner module defining the code available in the output VM
class SpiralModule extends code.AppModule {
    static get name() { return 'spiral'; }
    constructor(output) {
        super(output);
        this.addMethod('setColor', '_setColor');
        this.addMethod('setDensity', '_setDensity');
        this.addMethod('setWidth', '_setWidth');
    }
    _setColor(c) {
        const { spiral } = this.output.outputViewProvider;
        spiral.color = c;
    }
    _setDensity(d) {
        const { spiral } = this.output.outputViewProvider;
        spiral.pointsPerLap = d;
    }
    _setWidth(w) {
        const { spiral } = this.output.outputViewProvider;
        spiral.lineWidth = w;
    }
}

// OutputViewProvider creating a canvas and using the Spiral API to render the spiral
export class SpiralOutputViewProvider extends code.OutputViewProvider {
    constructor() {
        super();
        this._root = document.createElement('canvas');
        this._root.style.background = 'black';
        this._root.style.maxHeight = '100%';
        this.spiral = new Spiral(this._root);
    }
    start() {
        if (this.spiral) {
            this.spiral.dispose();
        }
        this.spiral = new Spiral(this._root, 500, 500);
        this.spiral.setup();
    }
    stop() {
        if (this.spiral) {
            this.spiral.dispose();
        }
    }
    render(ctx) {
        if (!this.resizedRender) {
            this.output.restart();
            this.resizedRender = true;
        }
        // Runner can take a step to restart code. Everything is rendering before painting frame
        return new Promise(resolve => setTimeout(resolve, 10))
            .then(() => {
                ctx.drawImage(this._root, 0, 0);
            });
    }
    get root() {
        return this._root;
    }
}

// OutpuProfile binding OutputViewProvider and Runner Module together
export class SpiralOutputProfile extends code.OutputProfile {
    constructor() {
        super();
        this._outputViewProvider = new SpiralOutputViewProvider();
    }
    get id() { return 'spiral'; }
    get outputViewProvider() {
        return this._outputViewProvider;
    }
    get modules() {
        return [SpiralModule];
    }
}

// WORKSPACE CONFIGURATION

// MetaAPI defining a module with two methods
const SpiralToolbox = {
    type: 'module',
    name: 'spiral',
    color: '#ba68c8',
    symbols: [{
        type: 'function',
        name: 'setColor',
        verbose: 'set color',
        parameters: [{
            name: 'color',
            verbose: '',
            returnType: 'Color',
            default: '#ba68c8',
        }],
    }, {
        type: 'function',
        name: 'setDensity',
        verbose: 'set density',
        parameters: [{
            name: 'density',
            verbose: '',
            returnType: Number,
            default: 6,
        }],
    }, {
        type: 'function',
        name: 'setWidth',
        verbose: 'set width',
        parameters: [{
            name: 'width',
            verbose: '',
            returnType: Number,
            default: 2,
        }],
    }],
};

code.Player.registerProfile(new SpiralOutputProfile());

class CreationDialogProvider extends code.DialogProvider {
    constructor() {
        super();
        this._creation = null;
        this.player = new code.Player();
        this._root = document.createElement('div');
        this._root.innerHTML = `
            <div id="output" style="width: 500px; height: 500px;">
            <button dialog-dismiss>Ok</button>
        `;
        this._root.style.padding = '0';
        this._root.style.margin = '0';
        this.player.inject(this._root.querySelector('#output'));
        window.player = this.player;
    }
    createDom() {
        return this._root;
    }
    setCreation(creation) {
        this._creation = creation;
        this.player.load(creation);
    }
    restart() {
        this.player.output.restart();
    }
}

// WorkspaceViewProvider creating a Dom node for the outputView, and some buttons in a toolbox
// Also uses some of the Editor API to display an alert and add Entries to the ActivityBar
export class SpiralWorkspaceViewProvider extends code.WorkspaceViewProvider {
    onInstall(editor) {
        this.editor = editor;

        this._root = document.createElement('div');
        this._root.innerHTML = `
            <style>
                #output {
                    text-align: center;
                }
                #tools {
                    padding: 32px;
                }
                button {
                    background: #ba68c8;
                    color: white;
                    border: 0px;
                    padding: 4px 16px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background: #ab47bc;
                }
                kc-workspace-toolbar {
                    margin: 32px;
                }
            </style>
            <div id="output" style="width: 100%; height: 500px;"></div>
            <kc-workspace-toolbar></kc-workspace-toolbar>
            <div id="tools">
                <button id="alert">Display Alert</button>
                <button id="activity-bar">Add ActivityBar entry</button>
                <button id="activity-bar-tooltip">Add ActivityBar tooltip entry</button>
                <button id="creation">Show creation</button>
            </div>
        `;
    }
    onInject() {
        // Create a new Alert with custom message
        this.alert = this.editor.dialogs.registerAlert({
            heading: 'Custom Alert',
            text: 'This is how to display alerts',
            buttonLabel: 'Ok',
        });
        // When the button is clicked, display the alert
        const button = this._root.querySelector('#alert');
        button.addEventListener('click', () => {
            this.alert.open();
        });
        const creationDialogProvider = new CreationDialogProvider();
        // Create a new dialog to display creations
        this.creationDialog = this.editor.dialogs.registerDialog(creationDialogProvider);
        // When the button is clicked, display the alert
        const creationButton = this._root.querySelector('#creation');
        creationButton.addEventListener('click', () => {
            creationDialogProvider.setCreation(this.editor.exportCreation());
            this.creationDialog.open();
            // Restart after a bit. Ensures the sizing of the output happens after the dialog opens
            setTimeout(() => {
                creationDialogProvider.restart();
            }, 100);
        });
        // Add an entry to the activityBar on each click of the button.
        const activityBarEntryButton = this._root.querySelector('#activity-bar');
        activityBarEntryButton.addEventListener('click', () => {
            const entry = this.editor.activityBar.registerEntry({
                title: 'Custom Entry',
                icon: './assets/code.png',
            });
            // Remove the entry when it is clicked
            entry.onDidActivate(() => {
                entry.dispose();
            });
        });
        const activityBarTooltipEntryButton = this._root.querySelector('#activity-bar-tooltip');
        activityBarTooltipEntryButton.addEventListener('click', () => {
            const root = document.createElement('div');
            root.style.padding = '16px';
            root.innerText = 'Tooltip';
            this.editor.activityBar.registerTooltipEntry({
                title: 'Custom Entry',
                icon: './assets/code.png',
                root,
                offset: Math.random() * 20,
            });
        });
    }
    get root() {
        return this._root;
    }
    get outputViewRoot() {
        return this.root.querySelector('#output');
    }
}

export class SpiralEditorProfile extends code.EditorProfile {
    get outputProfile() {
        return new SpiralOutputProfile();
    }
    get workspaceViewProvider() {
        return new SpiralWorkspaceViewProvider();
    }
    get toolbox() {
        return [SpiralToolbox];
    }
    get creationPreviewProvider() {
        return new code.CreationAnimationPreviewProvider({ width: 500, height: 500 }, 10, 10);
    }
}

export default SpiralOutputProfile;
