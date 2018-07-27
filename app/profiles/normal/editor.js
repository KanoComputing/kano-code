import * as code from '../../lib/index.js';

import general from '../../lib/parts/parts/canvas/blocks/general.js';
import paths from '../../lib/parts/parts/canvas/blocks/paths.js';
import setters from '../../lib/parts/parts/canvas/blocks/setters.js';
import shapes from '../../lib/parts/parts/canvas/blocks/shapes.js';
import space from '../../lib/parts/parts/canvas/blocks/space.js';

import { KanoCodeWorkspaceViewProvider } from '../../scripts/workspace/index.js';

import { PartsPlugin } from '../../lib/parts/index.js';

import { DrawOutputProfile } from './output.js';

import { AllApis, EventsModuleFactory } from '../../scripts/meta-api/all.js';
import { BackgroundEditorPlugin } from '../background/index.js';

const COLOR = '#82C23D';

let blocks = [];

blocks = blocks.concat(general);

blocks.push({
    block: part => ({
        id: 'clear',
        message0: `${part.name}: clear drawing`,
        previousStatement: null,
        nextStatement: null,
    }),
    javascript: () => function (block) {
        return `ctx.reset();\n`;
    },
});

blocks.push({
    block: part => ({
        id: 'set_transparency',
        message0: `${part.name}: set transparency to %1`,
        args0: [{
            type: 'input_value',
            name: 'ALPHA',
            check: 'Number',
        }],
        previousStatement: null,
        nextStatement: null,
        shadow: {
            ALPHA: '<shadow type="math_number"><field name="NUM">100</field></shadow>',
        },
    }),
    javascript: () => function (block) {
        const alpha = Blockly.JavaScript.valueToCode(block, 'ALPHA');
        return `ctx.setTransparency(${alpha});\n`;
    },
});

blocks = blocks.concat(setters);
blocks = blocks.concat(space);
blocks = blocks.concat(paths);
blocks = blocks.concat(shapes);

const categoryBlocks = blocks.map((definition) => {
    if (typeof definition === 'string') {
        return {
            id: definition,
            colour: COLOR,
        };
    }
    const block = definition.block({ id: 'draw' });
    block.colour = COLOR;
    return {
        id: block.id,
        colour: block.colour,
        shadow: block.shadow,
    };
});
const category = {
    name: 'Draw',
    id: 'draw',
    colour: COLOR,
    blocks: categoryBlocks,
};

const DrawToolbox = {
    type: 'blockly',
    id: 'draw',
    typeScriptDefinition: `
        declare namespace draw {}
    `,
    register(Blockly) {
        const definitions = [];
        blocks.forEach((definition) => {
            if (typeof definition === 'object') {
                definitions.push(definition);
            }
        });
        definitions.forEach((definition) => {
            const block = definition.block(DrawToolbox.category);
            block.colour = COLOR;
            if (!block.doNotRegister) {
                Blockly.Blocks[block.id] = {
                    init() {
                        this.jsonInit(block);
                    },
                };
                Blockly.Blocks[block.id].customColor = block.colour;
            }
            Blockly.JavaScript[block.id] = definition.javascript(DrawToolbox.category);
        });
    },
    category,
    defaults: {},
};

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
            data.source = '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="global_when" id="default_part_event_id" x="62" y="120"><field name="EVENT">global.start</field></block></xml>';
        }
    }
}

export class DrawEditorProfile extends code.EditorProfile {
    constructor(editor) {
        super();
        this.editor = editor;
        this._outputProfile = new DrawOutputProfile();
        this.eventsToolbox = EventsModuleFactory(this.editor);
        this._toolbox = AllApis.concat(DrawToolbox);
        this._toolbox.unshift(this.eventsToolbox);
    }
    get id() { return 'draw'; }
    get workspaceViewProvider() {
        const workspaceViewProvider = new KanoCodeWorkspaceViewProvider(
            'kano-editor-normal',
            {
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

export { DrawToolbox };
