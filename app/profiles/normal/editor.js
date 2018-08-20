import * as code from '../../lib/index.js';
import { DrawToolbox } from '../../lib/meta-api/modules/draw.js';
import { KanoCodeWorkspaceViewProvider } from '../../scripts/workspace/index.js';

import { PartsPlugin } from '../../lib/parts/index.js';

import { DrawOutputProfile } from './output.js';

import { AllApis, EventsModuleFactory } from '../../scripts/meta-api/all.js';
import { BackgroundEditorPlugin } from '../background/index.js';
import { customDrawBlocks } from '../common/custom-draw-blocks.js';

const COLOR = '#82C23D';

class WorkspaceFramePlugin extends code.Plugin {
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        this.editor.output.on('running-state-changed', () => {
            this.editor.workspaceView.root.running = this.editor.output.getRunningState();
        });
        this.editor.workspaceView.root.addEventListener('reset-app-state', () => {
            this.editor.output.restart();
        });
    }
}

class DefaultSourcePlugin extends code.Plugin {
    onInstall(editor) {
        this.editor = editor;
    }
    onImport(data) {
        if (!data || !data.source) {
            data = data || {};
            data.source = '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="global_when" id="default_part_event_id" x="62" y="120"><field name="EVENT">global.start</field></block></xml>';
        }
    }
}

const CustomDrawToolbox = Object.assign({}, DrawToolbox, {
    register(Blockly) {
        customDrawBlocks.forEach((block) => {
            Blockly.Blocks[block.block.id] = {
                init() {
                    this.jsonInit(block.block);
                }
            };
            Blockly.JavaScript[block.block.id] = block.javascript;
        });
        DrawToolbox.register(Blockly);
    },
});

CustomDrawToolbox.category.blocks = [...CustomDrawToolbox.category.blocks];
customDrawBlocks.reverse().forEach((block) => {
    const { id, color, shadow} = block.block;
    const customColor = color || COLOR;
    const categoryBlock = {
        id,
        colour: customColor,
        shadow
    };
    CustomDrawToolbox.category.blocks.unshift(categoryBlock);
})

export class DrawEditorProfile extends code.EditorProfile {
    constructor(editor) {
        super();
        this.editor = editor;
        this._outputProfile = new DrawOutputProfile();
        this.eventsToolbox = EventsModuleFactory(this.editor);
        this._toolbox = AllApis.concat(CustomDrawToolbox);
        this._toolbox.unshift(this.eventsToolbox);
    }
    get id() {
        return 'draw';
    }
    get workspaceViewProvider() {
        const workspaceViewProvider = new KanoCodeWorkspaceViewProvider(
            'kano-editor-normal', {
                width: 512,
                height: 384,
            },
        );
        return workspaceViewProvider;
    }
    get outputProfile() {
        return this._outputProfile;
    }
    get plugins() {
        return [new PartsPlugin(this.outputProfile.partsPlugin), new BackgroundEditorPlugin(this.outputProfile.backgroundPlugin), new WorkspaceFramePlugin(), new DefaultSourcePlugin()];
    }
    get toolbox() {
        return this._toolbox;
    }
}

export default DrawEditorProfile;
