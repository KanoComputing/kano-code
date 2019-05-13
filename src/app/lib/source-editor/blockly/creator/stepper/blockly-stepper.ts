import { Stepper } from '../../../../creator/stepper/stepper.js';
import { BlocklySourceEditor } from '../../../blockly.js';
import { Editor } from '../../../../editor/editor.js';
import { Workspace, Connection, Xml, Block, Field } from '@kano/kwc-blockly/blockly.js';
import { KanoCodeChallenge } from '../../challenge/kano-code.js';
import '../../challenge/index.js';
import BlocklyMetaRenderer from '../../api-renderer.js';
import { parseXml } from '../xml.js';
import { Challenge } from '../../../../challenge/challenge.js';

export class BlocklyStepper extends Stepper {
    public blockMap : WeakMap<Block, number> = new WeakMap();
    public fieldMap : WeakMap<Field, number> = new WeakMap();
    public customConnections : WeakMap<Connection, Connection> = new WeakMap();
    constructor(editor : Editor, challenge : Challenge) {
        super(editor, challenge);
    }
    stepTo(index : number) {
        const sourceEditor = this.editor.sourceEditor as BlocklySourceEditor;
        const workspace = sourceEditor.getWorkspace();
        const engine = this.challenge.engine as KanoCodeChallenge;
        const { steps, mappings } = engine._expandStepsWithMappings();
        this.challenge.reset();
        this.editor.load(JSON.parse(this.challenge.data.defaultApp!));
        for (let i = 0; i < index && i < steps.length; i += 1) {
            this.renderStep(workspace, steps[i], i, mappings);
        }
        const block = this.renderId(workspace, this.challenge.data.id);
        if (block) {
            workspace.centerOnBlock(block.id);
        }
        this.challenge.start();
        if (this.challenge.engine) {
            this.challenge.engine.stepIndex = index;
        }
    }
    renderId(workpsace: Workspace, id : string) {
        const block = this.createBlock(workpsace, 'generator_id');
        if (!block) {
            return;
        }
        block.setFieldValue(id, 'ID');
        return block;
    }
    renderStep(workspace : Workspace, step : any, index : number, mappings : Map<number, number>) {
        if (step.validation && step.validation.blockly) {
            if (step.validation.blockly.create) {
                this.renderCreate(workspace, step, index, mappings);
            } else if (step.validation.blockly.connect) {
                this.renderConnect(workspace, step.validation.blockly.connect, index);
            } else if (step.validation.blockly.value) {
                this.renderValue(workspace, step.validation.blockly.value, index, mappings);
            }
        } else {
            if (step.customStep) {
                this.renderCustomStep(workspace, step, index, mappings);
            } else if (step.startStep) {
                this.renderStartStep(workspace, step, index, mappings);
            } else if (step.bannerStep) {
                this.renderBannerStep(workspace, step, index, mappings);
            }
        }
        workspace.cleanUp();
    }
    renderCreate(workspace : Workspace, step : any, index : number, mappings : Map<number, number>) {
        const validation = step.validation.blockly.create;
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
        const originalIndex = this.getOriginalStepIndex(index, mappings);
        this.blockMap.set(block, originalIndex);
        const engine = this.challenge.engine as KanoCodeChallenge;
        if (validation.alias) {
            engine.aliases.set(validation.alias, `block#${block.id}`);
        }
    }
    getOriginalStepIndex(index : number, mappings : Map<number, number>) {
        const originalIndex = mappings.get(index);
        if (typeof originalIndex === 'undefined') {
            throw new Error(`Could not get original index for expanded steps: Index '${index}' does not have a mapping`);
        }
        return originalIndex;
    }
    getOriginalStep(index : number) {
        const originalStepIndex = this.challenge.engine!.stepsMappings.get(index);
        return this.challenge.engine!._steps[originalStepIndex!];
    }
    renderConnect(workspace : Workspace, validation : any, index : number) {
        const parent = this.editor.querySelector(validation.parent);
        const target = this.editor.querySelector(validation.target);
        if (!parent || !target) {
            // TODO: deal here
            return;
        }
        let connection : Connection|null = null;
        if (parent.connection) {
            connection = parent.connection;
        } else if (parent.input) {
            connection = parent.input.connection;
        }
        if (!connection) {
            // TODO: Deal
            return;
        }
        connection.connect(target.block.outputConnection || target.block.previousConnection);
    }
    renderValue(workspace : Workspace, validation : any, index : number, mappings : Map<number, number>) {
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
            this.fieldMap.set(result.field, this.getOriginalStepIndex(index, mappings));
            result.field.setValue(validation.value);
        }
    }
    renderGeneratorStep(workspace : Workspace, validation : any, index : number, type : string, mappings : Map<number, number>) {
        const block = this.createBlock(workspace, type);
        if (!block) {
            // TODO: Deal here
            return;
        }
        this.blockMap.set(block, this.getOriginalStepIndex(index, mappings));
        const engine = this.challenge.engine as KanoCodeChallenge;
        if (validation.alias) {
            engine.aliases.set(validation.alias, `block#${block.id}`);
        }
        const parent = this.editor.querySelector(validation.parent);
        if (!parent) {
            // TODO: deal here
            return;
        }
        let connection : Connection|null = null;
        if (parent.connection) {
            connection = parent.connection;
        } else if (parent.input) {
            connection = parent.input.connection;
        }
        if (!connection) {
            // TODO: Deal
            return;
        }
        connection.connect(block.previousConnection!);
        return block;
    }
    renderCustomStep(workspace : Workspace, validation : any, index : number, mappings : Map<number, number>) {
        this.renderGeneratorStep(workspace, validation, index, 'generator_step', mappings);
    }
    renderStartStep(workspace : Workspace, validation : any, index : number, mappings : Map<number, number>) {
        this.renderGeneratorStep(workspace, validation, index, 'generator_start', mappings);
    }
    renderBannerStep(workspace : Workspace, validation : any, index : number, mappings : Map<number, number>) {
        const block = this.renderGeneratorStep(workspace, validation, index, 'generator_banner', mappings);
        if (!block) {
            // TODO: Deal
            return;
        }
        if (!validation.banner) {
            return;
        }
        block.setFieldValue(validation.banner.text || validation.banner, 'TEXT');
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
