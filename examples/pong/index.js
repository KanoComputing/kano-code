import * as code from '../../index.js';
import * as api from '../../api.js';
import * as i18n from '../../i18n.js';
import { PongOutputProfile } from './profile.js';

const lang = i18n.getLang();

// Load Kano Code locales and elements
Promise.all([
    i18n.load(`/locale/editor/${lang}.json`),
    i18n.loadBlocklyMsg(`/locale/blockly/${lang}.json`),
    i18n.loadBlocklyMsg('/node_modules/@kano/kwc-blockly/blockly_built/msg/json/en.json'),
    i18n.loadBlocklyMsg('/node_modules/@kano/kwc-blockly/blockly_built/msg/json/constants.json'),
]).then(() => {
    // Define what the workpsace will be, in this case, it only contains the output
    // and an output code element to display the generated code in real time
    class PongWorkspaceViewProvider extends code.WorkspaceViewProvider {
        onInstall(editor) {
            this.editor = editor;
            this.root = document.createElement('div');
            this.root.innerHTML = `
                <style>
                    #tools {
                        color: white;
                        padding: 32px;
                        font-family: Arial;
                    }    
                </style>
                <div id="output"></div>
                <div id="tools">
                    <pre>
                        <code id="code-output"></code>    
                    </pre>
                </div>
            `;
            this.root.style.width = '100%';
            // Listen to the running state change
            this.editor.output.on('running-state-changed', () => {
                this.updateCodeOutput();
            });
        }
        get outputViewRoot() {
            return this.root.querySelector('#output');
        }
        updateCodeOutput() {
            // Put the current code from the editor in the code element
            this.root.querySelector('#code-output').innerHTML = `\n${this.editor.output.getCode() || ''}`;
        }
    }

    // CReate the editor
    const editor = new code.Editor();

    // Create the toolbox defining three methods in the pong module
    const PongToolbox = {
        type: 'module',
        name: 'pong',
        color: '#00796b',
        symbols: [{
            type: 'function',
            name: 'setBackgroundColor',
            verbose: 'Background color',
            parameters: [{
                name: 's',
                verbose: '',
                returnType: 'Color',
                default: '#000000',
            }],
        }, {
            type: 'function',
            name: 'setBallSize',
            verbose: 'Ball size',
            parameters: [{
                name: 's',
                verbose: '',
                returnType: Number,
                default: 20,
            }],
        }, {
            type: 'function',
            name: 'setBallColor',
            verbose: 'Ball color',
            parameters: [{
                name: 'c',
                verbose: '',
                returnType: 'Color',
                default: '#ffffff',
            }],
        }],
    };

    const AIToolbox = {
        type: 'module',
        name: 'ai',
        color: '#00796b',
        symbols: [{
            type: 'function',
            name: 'position',
            verbose: 'AI paddle position',
            returnType: Number,
        }, {
            type: 'function',
            name: 'move',
            verbose: 'Move AI paddle by',
            parameters: [{
                type: Number,
                name: 'amount',
                verbose: '',
                default: 1,
            }],
        }],
    };

    const BallToolbox = {
        type: 'module',
        name: 'ball',
        color: '#00796b',
        symbols: [{
            type: 'function',
            name: 'position',
            verbose: 'Ball position',
            returnType: Number,
        }],
    };

    class PongProfile extends code.EditorProfile {
        onInstall() {
            this._outputProfile = new PongOutputProfile();
            this._workspaceViewProvider = new PongWorkspaceViewProvider();
        }
        get outputProfile() {
            return this._outputProfile;
        }
        get workspaceViewProvider() {
            return this._workspaceViewProvider;
        }
        get toolbox() {
            return [
                api.MathAPI,
                api.ControlAPI,
                api.LogicAPI,
                PongToolbox,
                AIToolbox,
                BallToolbox,
            ];
        }
    }

    editor.registerProfile(new PongProfile());

    editor.inject();

    fetch('./default.xml')
        .then(r => r.text())
        .then((source) => {
            editor.load({ source });
            editor.output.setRunningState(true);
        });

});
