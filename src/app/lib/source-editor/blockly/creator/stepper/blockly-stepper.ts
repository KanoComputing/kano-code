import { Stepper } from '../../../../creator/stepper/stepper.js';
import { BlocklySourceEditor } from '../../../blockly.js';
import { Editor } from '../../../../editor/editor.js';
import { Workspace, Connection, Xml, Block, Field } from '@kano/kwc-blockly/blockly.js';
import { KanoCodeChallenge } from '../../challenge/kano-code.js';
import '../../challenge/index.js';
import BlocklyMetaRenderer from '../../api-renderer.js';
import { parseXml } from '../xml.js';
import { IDisposable } from 'monaco-editor';

export class BlocklyStepper extends Stepper {
    public blockMap : WeakMap<Block, any> = new WeakMap();
    public fieldMap : WeakMap<Field, any> = new WeakMap();
    public customConnections : WeakMap<Connection, Connection> = new WeakMap();
    public engine : KanoCodeChallenge;
    private aliases : IDisposable[] = [];
    constructor(editor : Editor) {
        super(editor);
        this.engine = new KanoCodeChallenge(this.editor);
    }
    stepTo(index : number, data : any) {
        const sourceEditor = this.editor.sourceEditor as BlocklySourceEditor;
        const workspace = sourceEditor.getWorkspace();
        this.engine.setSteps(data.steps);
        const { steps, mappings } = this.engine._expandStepsWithMappings();
        const maxIndex = Math.min(index, steps.length);
        if (data.defaultApp) {
            this.editor.load(JSON.parse(data.defaultApp));
        } else {
            console.log(data.defaultApp);
            this.editor.reset();
        }
        for (let i = 0; i < maxIndex; i += 1) {
            const originalStep = this.getOriginalStep(data.steps, i, mappings);
            this.renderStep(workspace, steps[i], i, originalStep);
        }
        const block = this.renderId(workspace, data.id);
        if (block) {
            workspace.centerOnBlock(block.id);
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
    renderStep(workspace : Workspace, step : any, index : number, original : any) {
        if (step.validation && step.validation.blockly) {
            if (step.validation.blockly.create) {
                this.renderCreate(workspace, step, index, original);
            } else if (step.validation.blockly.connect) {
                this.renderConnect(workspace, step.validation.blockly.connect, index);
            } else if (step.validation.blockly.value) {
                this.renderValue(workspace, step.validation.blockly.value, index, original);
            }
        } else {
            if (step.customStep) {
                this.renderCustomStep(workspace, step, index, original);
            } else if (step.startStep) {
                this.renderStartStep(workspace, step, index, original);
            } else if (step.bannerStep) {
                this.renderBannerStep(workspace, step, index, original);
            }
        }
        workspace.cleanUp();
    }
    renderCreate(workspace : Workspace, step : any, index : number, original : any) {
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
        this.blockMap.set(block, original);
        if (validation.alias) {
            this.aliases.push(this.editor.registerAlias(validation.alias, `block#${block.id}`));
        }
    }
    getOriginalStepIndex(index : number, mappings : Map<number, number>) {
        const originalIndex = mappings.get(index);
        if (typeof originalIndex === 'undefined') {
            throw new Error(`Could not get original index for expanded steps: Index '${index}' does not have a mapping`);
        }
        return originalIndex;
    }
    getOriginalStep(steps : any[], index : number, mappings : Map<number, number>) {
        const originalStepIndex = this.getOriginalStepIndex(index, mappings);
        return steps[originalStepIndex!];
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
    renderValue(workspace : Workspace, validation : any, index : number, original : any) {
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
            this.fieldMap.set(result.field, original);
            result.field.setValue(validation.value);
        }
    }
    renderGeneratorStep(workspace : Workspace, validation : any, index : number, type : string, original : any) {
        const block = this.createBlock(workspace, type);
        if (!block) {
            // TODO: Deal here
            return;
        }
        this.blockMap.set(block, original);
        if (validation.alias) {
            this.aliases.push(this.editor.registerAlias(validation.alias, `block#${block.id}`));
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
    renderCustomStep(workspace : Workspace, validation : any, index : number, original : any) {
        this.renderGeneratorStep(workspace, validation, index, 'generator_step', original);
    }
    renderStartStep(workspace : Workspace, validation : any, index : number, original : any) {
        this.renderGeneratorStep(workspace, validation, index, 'generator_start', original);
    }
    renderBannerStep(workspace : Workspace, validation : any, index : number, original : any) {
        const block = this.renderGeneratorStep(workspace, validation, index, 'generator_banner', original);
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
