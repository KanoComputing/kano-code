import { Stepper } from '../../../../creator/stepper/stepper.js';
import { BlocklySourceEditor } from '../../../blockly.js';
import { Editor } from '../../../../editor/editor.js';
import { Workspace, Connection, Xml } from '@kano/kwc-blockly/blockly.js';
import { KanoCodeChallenge } from '../../challenge/kano-code.js';
import '../../challenge/index.js';
import BlocklyMetaRenderer from '../../api-renderer.js';
import { parseXml } from '../xml.js';
import { Challenge } from '../../../../challenge/challenge.js';

export class BlocklyStepper extends Stepper {
    constructor(editor : Editor, challenge : Challenge) {
        super(editor, challenge);
    }
    stepTo(index : number) {
        const sourceEditor = this.editor.sourceEditor as BlocklySourceEditor;
        const workspace = sourceEditor.getWorkspace();
        const engine = this.challenge.engine as KanoCodeChallenge;
        const steps = engine._expandSteps();
        this.challenge.reset();
        this.editor.load({ source: '<xml></xml>' });
        console.log(steps, index);
        for (let i = 0; i < index && i < steps.length; i += 1) {
            this.renderStep(workspace, steps[i]);
        }
        this.challenge.start();
        if (this.challenge.engine) {
            this.challenge.engine.stepIndex = index;
        }
    }
    renderStep(workspace : Workspace, step : any) {
        if (!step.validation || !step.validation.blockly) {
            return;
        }
        if (step.validation.blockly.create) {
            this.renderCreate(workspace, step.validation.blockly.create)
        } else if (step.validation.blockly.connect) {
            this.renderConnect(workspace, step.validation.blockly.connect)
        } else if (step.validation.blockly.value) {
            this.renderValue(workspace, step.validation.blockly.value)
        }
        workspace.cleanUp();
    }
    renderCreate(workspace : Workspace, validation : any) {
        const result = this.editor.querySelector(validation.type);
        if (!result) {
            // TODO: Deal here
            return;
        }
        const type = result.getId();
        const block = this.createBlock(workspace, type);
        if (!block) {
            // TODO: Deal here
            return;
        }
        const engine = this.challenge.engine as KanoCodeChallenge;
        if (validation.alias) {
            engine.aliases.set(validation.alias, `block#${block.id}`);
        }
    }
    renderConnect(workspace : Workspace, validation : any) {
        const parent = this.editor.querySelector(validation.parent);
        const target = this.editor.querySelector(validation.target);
        if (!parent || !target) {
            // TODO: deal here
            return;
        }
        let connection : Connection|null = null;
        if (parent.input) {
            connection = parent.input.connection;
        }
        if (!connection) {
            // TODO: Deal
            return;
        }
        connection.connect(target.block.outputConnection || target.block.previousConnection);
    }
    renderValue(workspace : Workspace, validation : any) {
        // No value defined, just don't change it
        if (!validation.value) {
            return;
        }
        const result = this.editor.querySelector(validation.target);
        if (!result) {
            // TODO: Deal here
            return;
        }
        if (result.field) {
            result.field.setValue(validation.value);
        }
    }
    createBlock(workspace : Workspace, type : string) {
        const renderer = this.editor.toolbox.renderer as BlocklyMetaRenderer;
        const entry = renderer.getEntryForBlock(type);
        if (!entry) {
            // TODO: Deal here
            return;
        }
        const blockDef = (this.editor.sourceEditor as BlocklySourceEditor).getToolboxBlockByType(entry.def.name, type);
        const block = workspace.newBlock(type);
        if (blockDef.shadow) {
            Object.keys(blockDef.shadow).forEach((name) => {
                const dom = parseXml(blockDef.shadow[name]);
                const bl = Xml.domToBlock(dom.documentElement, workspace);
                const input = block.getInput(name);
                if (!input || !input.connection) {
                    return;
                }
                const targetConnection = bl.outputConnection || bl.previousConnection;
                if (!targetConnection) {
                    return;
                }
                input.connection.connect(targetConnection);
            });
        }
        block.initSvg();
        block.render();
        return block;
    }
}
