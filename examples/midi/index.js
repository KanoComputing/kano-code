import { EventEmitter } from '@kano/common/index.js';
import * as code from '../../app/lib/index.js';
import { PartsOutputPlugin, PartsPlugin } from '../../app/lib/parts/index.js';
import '../../app/elements/kc-workspace-frame/kc-parts-controls.js';
import PartsModule from '../../app/lib/app-modules/parts.js';
import TimeModule from '../../app/lib/app-modules/time.js';
import ControlsToolbox from '../../app/lib/meta-api/modules/control.js';
import Hardware from '../../app/lib/parts/hardware/index.js';

import { SpeakerFactory } from '../../app/lib/parts/parts/speaker/factory.js';

import { SamplesGenerator, SamplesDirGenerator } from '../../app/lib/parts/parts/speaker/samples.js';

const samples = SamplesGenerator('/');
const samplesDir = SamplesDirGenerator('/');

const Speaker = SpeakerFactory('http://localhost:4000', samples, samplesDir, 'Drum Machine');

class MIDIController {
    constructor() {
        this._controls = new Map();
        this._onDidFindMIDIDevice = new EventEmitter();
        navigator.requestMIDIAccess()
            .then((access) => {
                const it = access.inputs.values();
                const inst = it.next();
                const input = inst.value;
                this._setDevice(input);
            })
            .catch((e) => {
                console.error(e);
                throw e;
            });
    }
    _setDevice(input) {
        this._input = input;
        this._onDidFindMIDIDevice.fire(input);
        input.onmidimessage = (message) => {
            const [command, note, velocity] = message.data;
            switch (command) {
            case 176: {
                this._controls.set(note, velocity);
                break;
            }
            default: {
                break;
            }
            }
        };
    }
    get onDidFindMIDIDevice() {
        return this._onDidFindMIDIDevice.event;
    }
}

const controller = new MIDIController();

class MIDIModule extends code.AppModule {
    static get id() {
        return 'midi';
    }
    constructor(output) {
        super(output);
        this.addMethod('getKnob', '_getKnob');
    }
    _getKnob(id) {
        const v = controller._controls.get(id || 52);
        return typeof v === 'undefined' ? 100 : v;
    }
}


// Output: Creates the canvas, render on refresh
class MIDIOutputViewProvider extends code.OutputViewProvider {
    onInstall(output) {
        this.output = output;
        this._root = document.createElement('canvas');
        this._root.style.background = '#f9f9f9';
        this._root.style.maxWidth = '100%';
        this._root.style.maxHeight = '100%';
        this._root.width = 500;
        this._root.height = 500;
    }
    get root() {
        return this._root;
    }
    get partsRoot() {
        return this._root;
    }
}

// Workspace: Just hosts the output
class MIDIWorkspaceViewProvider extends code.WorkspaceViewProvider {
    onInstall(editor) {
        this.editor = editor;
        this._root = document.createElement('div');
        this._root.innerHTML = `
            <div id="canvas"></div>
            <div id="info" style="color: white"></div>
            <kc-parts-controls store-id="${editor.store.id}"></kc-parts-controls>
        `;
        this._root.style.textAlign = 'center';
        controller.onDidFindMIDIDevice((input) => {
            this._root.querySelector('#info').innerText = input.name;
        });
    }
    get partsControls() {
        return this._root.querySelector('kc-parts-controls');
    }
    get root() {
        return this._root;
    }
    get outputViewRoot() {
        return this.root.querySelector('#canvas');
    }
}

// OutputProfile: Loads OutputView and modules together
class MIDIOutputProfile extends code.OutputProfile {
    constructor() {
        super();
        this._outputViewProvider = new MIDIOutputViewProvider();
        this.partsPlugin = new PartsOutputPlugin([Hardware], [Speaker]);
    }
    get id() { return 'MIDI'; }
    get outputViewProvider() {
        return this._outputViewProvider;
    }
    get modules() {
        return [MIDIModule, PartsModule, TimeModule];
    }
    get plugins() {
        return [this.partsPlugin];
    }
}

code.Player.registerProfile(new MIDIOutputProfile());

// Toolbox: Defines coding API available for users
const MIDIToolbox = {
    type: 'module',
    name: 'midi',
    color: '#0d47a1',
    symbols: [{
        type: 'function',
        name: 'getKnob',
        verbose: 'knob 1',
        returnType: Number,
    }],
};

// EditorProfile: Loads WorkspaceViewProvider and Toolbox together
const workspaceProfile = {
    onInstall() {
        this.partsPlugin = new PartsPlugin(this.outputProfile.partsPlugin);
    },
    outputProfile: new MIDIOutputProfile(),
    workspaceViewProvider: new MIDIWorkspaceViewProvider(),
    toolbox: [ControlsToolbox, MIDIToolbox],
    get plugins() {
        return [this.partsPlugin];
    },
};

// Create editor
const editor = new code.Editor({
    BLOCKLY_MEDIA: '/node_modules/@kano/kwc-blockly/blockly_built/media/',
});

// Load profile
editor.registerProfile(workspaceProfile);

// Add to the window
editor.inject();

// Start the output
editor.output.setRunningState(true);
