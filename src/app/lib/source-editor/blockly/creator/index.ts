import { Creator, IGeneratedStep } from '../../../creator/creator.js';
import { BlocklySourceEditor } from '../../blockly.js';
import { Xml, Block, Field } from '@kano/kwc-blockly/blockly.js';
import { BlocklyCreatorToolbox } from './toolbox.js';
import { findStartNodes, getAncestor, parseXml, findFirstTreeDiff, DiffResultType, nodeIsNonShadowStatementOrValue, IInnerTextDiffResult, getSelectorForNode } from './xml.js';
import BlocklyMetaRenderer from '../api-renderer.js';
import { SourceEditor } from '../../source-editor.js';
import { findInSet } from '../../../util/set.js';
import { registerCreator, getHelpers, ICreatorHelper } from '../../../creator/index.js';
import Editor from '../../../editor/editor.js';
import { BlocklyStepper } from './stepper/blockly-stepper.js';
export * from './helpers.js';

const CUSTOM_BLOCKS = ['generator_step', 'generator_banner', 'generator_id'];

function isBlocklySourceEditor(sourceEditor : SourceEditor) : sourceEditor is BlocklySourceEditor {
    return sourceEditor.editor.sourceType === 'blockly';
}

interface IConnectionInfo {
    name : string;
    parentStep? : IGeneratedStep;
    id? : string;
}

export class BlocklyCreator extends Creator<BlocklyStepper> {
    sourceEditor? : BlocklySourceEditor;
    aliasCounter : number = -1;
    helpers : ICreatorHelper[];
    constructor(editor : Editor) {
        super(editor);
        this.helpers = getHelpers('blockly') || [];
    }
    createStepper() {
        return new BlocklyStepper(this.editor);
    }
    createAlias(prefix = 'block') {
        this.aliasCounter += 1;
        return `${prefix}_${this.aliasCounter}`;
    }
    onInject() {
        super.onInject();
        this.editor.toolbox.addEntry(BlocklyCreatorToolbox, 0);
        if (isBlocklySourceEditor(this.editor.sourceEditor)) {
            this.sourceEditor = this.editor.sourceEditor;
        }
    }
    generate() {
        this.stepsMap.clear();
        this.aliasCounter = -1;
        const challenge = super.generate();
        let steps = challenge.steps;
        if (!this.sourceEditor) {
            throw new Error('Could not generate challenge steps: The editor was not injected');
        }
        const workspace = this.sourceEditor.getWorkspace();
        const dom = Xml.workspaceToDom(workspace);
        const startOptions = findStartNodes(dom);
        startOptions.forEach((startOption) => {
            if (!startOption.start || startOption.start.tagName === 'variables') {
                return;
            }
            if (startOption.start.getAttribute('type') === 'generator_start') {
                steps = steps.concat(this.startToSteps(startOption.start));
            } else {
                steps = steps.concat(this.blockToSteps(startOption.start));
            }
        });

        const id = this.generateChallengeId(dom);
        
        return Object.assign(challenge, { steps, id });
    }
    generateChallengeId(dom : XMLDocument) {
        const field = dom.querySelector('block[type="generator_id"]>field[name="ID"]');
        if (!field) {
            return '';
        }
        return field.textContent;
    }
    getConnectionForStatementOrValue(block : HTMLElement) : string|null {
        // Find the statement or value node that hosts the block. Make sure to not accept statements or values inside a shadow block
        const input = getAncestor(block, b => nodeIsNonShadowStatementOrValue(b));
        if (!input) {
            return null;
        }
        // Find the input's parent block
        const parentBlock = getAncestor(input, b => b.tagName.toLowerCase() === 'block') as HTMLElement;
        // Bail out if it doesn't have a parent
        if (!parentBlock) {
            return null;
        }
        let selector = getSelectorForNode(block, parentBlock);
        const parentBlockId = parentBlock.getAttribute('id')!
        // Retrieve the step that created this parent block
        const source = `block#${parentBlockId}`;
        const step = this.stepsMap.get(source);
        // No step means the block is in the default app, in that case return the id of the parent block
        if (!step) {
            return `block#${parentBlockId}>${selector}`;
        }
        const stepData = step.data;
        // There is a parent step found, get the alias
        return `alias#${stepData.alias}>${selector}`;
    }
    generateConnectionQuery(result : IConnectionInfo) {
        let connectionQuery = null;
        if (result.parentStep) {
            const stepData = result.parentStep.data;
            // There is a parent step found, get the alias
            connectionQuery = `alias#${stepData.alias}>input#${result.name}`;
        } else if (result.id) {
            // There no parent found, but we got an id, use the id
            connectionQuery = `block#${result.id}>input#${result.name}`;
        }
        return connectionQuery;
    }
    customBlockToSteps(block : HTMLElement) {
        const type = block.getAttribute('type');
        const id = block.getAttribute('id');
        if (!type) {
            return [];
        }
        let steps : IGeneratedStep[] = [];
        if (type === 'generator_step') {
            const customStep = {
                source: `block#${id}`,
                data: {
                    customStep: true,
                    parent: this.getConnectionForStatementOrValue(block),
                    alias: this.createAlias('custom_step'),
                },
            } as IGeneratedStep;
            steps.push(customStep);
            Object.assign(customStep.data, this.getOriginalStepFromSource(customStep.source));
            this.stepsMap.set(customStep.source, customStep);
            const next = block.querySelector('next') as HTMLElement;
            if (next) {
                steps = steps.concat(this.nodeToSteps(next));
            }
            return steps;
        } else if (type === 'generator_banner') {
            const field = block.querySelector('field[name="TEXT"]') as HTMLElement;
            if (!field) {
                return steps;
            }
            const step = {
                source: `block#${id}`,
                data: {
                    banner: {
                        text: field.innerText,
                        nextButton: true,
                    },
                    bannerStep: true,
                    parent: this.getConnectionForStatementOrValue(block),
                    alias: this.createAlias('custom_banner'),
                },
            } as IGeneratedStep;
            steps.push(step);
            Object.assign(step.data, this.getOriginalStepFromSource(step.source));
            this.stepsMap.set(step.source, step);
            const next = block.querySelector('next') as HTMLElement;
            if (next) {
                steps = steps.concat(this.nodeToSteps(next));
            }
            return steps;
        }
        return [];
    }
    startToSteps(block : HTMLElement) {
        const id = block.getAttribute('id');
        if (!id) {
            return [];
        }
        const step = {
            source: `block#${id}`,
            data: {
                startStep: true,
                alias: this.createAlias('start'),
                parent: this.getConnectionForStatementOrValue(block),
            }
        };
        this.stepsMap.set(step.source, step);
        let steps : IGeneratedStep[] = [step];
        for (const child of block.children) {
            steps = steps.concat(this.nodeToSteps(child as HTMLElement));
        }
        return steps;
    }
    blockToSteps(block : HTMLElement) : IGeneratedStep[] {
        const renderer = this.editor.toolbox.renderer as BlocklyMetaRenderer;
        const type = block.getAttribute('type');
        const id = block.getAttribute('id');
        if (!type) {
            return [];
        }
        // Handle the blocks from the generator category separately
        if (CUSTOM_BLOCKS.indexOf(type) !== -1) {
            return this.customBlockToSteps(block);
        }
        // Find the toolbox entry that matches this block type
        const entry = renderer.getEntryForBlock(type);
        if (!entry) {
            return [];
        }
        // The default category is the toolbox
        let category = `toolbox#${entry.def.name}`;
        // Try to match a part to the toolbox entry
        const parts = this.editor.output.parts.getParts();
        const matchingPart = findInSet(parts, (part) => part.id === entry.def.name);
        if (matchingPart) {
            // Found a matching part, try to get the step that created the part
            const parentStep = this.stepsMap.get(`part#${matchingPart.id}`);
            if (parentStep && parentStep.data.alias) {
                // Use the part alias as selector
                category = `alias#${parentStep.data.alias}>toolbox`;
            } else {
                // No step or the step didn't define an alias, use the part id
                category = `part#${matchingPart.id}>toolbox`;
            }
        }
        // Resolve an eventual parent connection
        let connectionQuery = this.getConnectionForStatementOrValue(block);
        // This is the actual step generated
        const createBlockStep : IGeneratedStep = {
            source: `block#${id}`,
            data: {
                type: 'create-block',
                category,
                blockType: type,
                alias: this.createAlias(),
                openFlyoutCopy: `Open the ${entry.getVerboseDisplay()} tray`,
                grabBlockCopy: 'Pick up the block with your mouse or finger and drag it into the middle',
            },
        };
        // The connect field is only added when a connection is required
        if (connectionQuery) {
            createBlockStep.data.connectTo = connectionQuery;
            createBlockStep.data.connectCopy = 'Connect please';
        } else {
            createBlockStep.data.dropCopy = 'Drop it onto your code space to add it into your program.';
        }
        const originalStep = this.getOriginalStepFromSource(`block#${id}`) || {};
        // Apply sources
        Object.assign(createBlockStep.data, originalStep);
        // Keep track of that new step, map it to its source block.
        this.stepsMap.set(createBlockStep.source, createBlockStep);
        let blockSteps : IGeneratedStep[] = [createBlockStep];
        // Go through all blocks and generated their steps
        for (const child of block.children) {
            blockSteps = blockSteps.concat(this.nodeToSteps(child as HTMLElement));
        }
        return blockSteps;
    }
    getOriginalStepFromSource(source : string) {
        const result = this.editor.querySelector(source);
        if (!result) {
            throw new Error('Deal with this please');
        }
        if (result.block) {
            return this.stepper.blockMap.get(result.block);
        } else if (result.input) {
            console.log(result.input);
        } else if (result.field) {
            return this.stepper.fieldMap.get(result.field);
        }
    }
    /**
     * For a given Blockly XML node, generate the matching steps
     * This only acts as a router for the different types of blocks that this generator can handle 
     * @param node The node in the Blockly XMLtree used as a source to generate the steps
     */
    nodeToSteps(node : HTMLElement) : IGeneratedStep[] {
        switch (node.tagName.toLowerCase()) {
            // next and statement can be handled the same way
            case 'next':
            case 'statement': {
                return this.statementOrNextToSteps(node);
            }
            case 'value': {
                return this.valueToSteps(node);
            }
            case 'field': {
                return this.fieldToSteps(node);
            }
        }
        return [];
    }
    /**
     * Find the first block node under a statement or next node and generate the steps
     * @param node A statement or next node to generate steps from
     */
    statementOrNextToSteps(node : HTMLElement) : IGeneratedStep[] {
        // Statements only have one block in them
        const block = node.querySelector('block') as HTMLElement;
        if (!block) {
            return [];
        }
        return this.blockToSteps(block);
    }
    valueToSteps(node : HTMLElement) : IGeneratedStep[] {
        const name = node.getAttribute('name') || '';
        // Statements only have one block in them
        const block = [...node.children].find(n => n.tagName.toLowerCase() === 'block') as HTMLElement;
        if (!block) {
            const shadow = node.querySelector('shadow') as HTMLElement;
            if (!shadow) {
                return [];
            }
            return this.shadowToSteps(node.parentElement!, name, shadow);
        }
        return this.blockToSteps(block);
    }
    fieldToSteps(node : HTMLElement) : IGeneratedStep[] {
        const name = node.getAttribute('name')!;
        const parent = node.parentElement!;
        const parentType = parent.getAttribute('type')!;
        const parentId = parent.getAttribute('id')!;
        const renderer = this.editor.toolbox.renderer as BlocklyMetaRenderer;
        const defaults = renderer.getDefaultsForBlock(parentType);
        if (!defaults || !defaults[name]) {
            console.warn(`Could not infer step for challenge: Block '${parentType}' has no default definition`);
            return [];
        }
        const defaultValue = defaults[name].value;
        if (!defaultValue) {
            console.warn(`Could not infer step for challenge: Block '${parentType}' is missing a default declaration for value '${name}'`);
            return [];
        }
        const currentValue = node.textContent!;
        if (defaultValue === currentValue) {
            return [];
        }
        const source = `block#${parentId}`;
        const parentStep = this.stepsMap.get(source);
        let target;
        // This comes from a default block, point to the block using its id
        if (!parentStep) {
            target = `block#${parentId}`;
        } else {
            target = `alias#${parentStep.data.alias}>input#${name}`;
        }
        let step : IGeneratedStep = {
            source: `block#${parentId}>input#${name}`,
            data: {
                type: 'change-input',
                target,
                value: currentValue,
                bannerCopy: `Change the strength from <kano-value-preview><span>${defaultValue || 'ERROR'}</span></kano-value-preview> to <kano-value-preview><span>${currentValue || 'ERROR'}</span></kano-value-preview>`,
            },
        };
        const originalStep = this.getOriginalStepFromSource(step.source);
        const field = this.getFieldForNode(node);
        if (field) {
            step = this.runFieldHelper(field, defaultValue, currentValue, step);
        }
        return [step];
    }
    getFieldForNode(node : HTMLElement) {
        if (!this.sourceEditor) {
            return null;
        }
        const name = node.getAttribute('name');
        if (!name) {
            return null;
        }
        const parent = node.parentElement;
        if (!parent) {
            return null;
        }
        const parentId = parent.getAttribute('id');
        if (!parentId) {
            return null;
        }
        const workspace = this.sourceEditor.getWorkspace();
        const block = workspace.getBlockById(parentId);
        if (!block) {
            return null;
        }
        return block.getField(name);
    }
    runFieldHelper(field : Field, defaultValue : string, currentValue : string, step : IGeneratedStep) {
        this.helpers.forEach((helper) => {
            if (typeof helper.field === 'function') {
                step = helper.field(field, defaultValue, currentValue, step);
            }
        });
        return step;
    }
    shadowToSteps(parent : HTMLElement, inputName : string, shadow : HTMLElement) : IGeneratedStep[] {
        const parentType = parent.getAttribute('type');
        const id = shadow.getAttribute('id');
        if (!parentType || !id) {
            return [];
        }
        const renderer = this.editor.toolbox.renderer as BlocklyMetaRenderer;
        const defaults = renderer.getDefaultsForBlock(parentType);
        if (!defaults || !defaults[inputName]) {
            throw new Error(`Could not infer challenge step in shadow block: Missing default definition for input '${inputName}' in block '${parentType}'`);
        }
        const shadowString = defaults[inputName].shadow;
        if (!shadowString) {
            throw new Error(`Could not infer challenge step in shadow block: Missing default definition for input '${inputName}' in block '${parentType}'`);
        }
        const shadowTree = parseXml(shadowString);
        const result = findFirstTreeDiff(shadowTree.documentElement, shadow);
        if (result.type === DiffResultType.INNER_TEXT) {
            const parentId = parent.getAttribute('id')!;
            const source = `block#${parentId}`;
            const parentStep = this.stepsMap.get(source);
            let selector = getSelectorForNode(result.bNode, parent);
            // This comes from a default block, point to the block using its id
            if (!parentStep) {
                selector = `block#${id}>${selector}`;
            } else {
                selector = `alias#${parentStep.data.alias}>${selector}`;
            }
            let step = {
                source: `block#${id}`,
                data: {
                    type: 'change-input',
                    target: selector,
                    value: result.to,
                    bannerCopy: `Change the strength from <kano-value-preview><span>${result.from}</span></kano-value-preview> to <kano-value-preview><span>${result.to}</span></kano-value-preview>`,
                },
            } as IGeneratedStep;
            const field = this.getFieldForInnerTextResult(result);
            if (field) {
                step = this.runFieldHelper(field, result.from!, result.to!, step);
            }
            this.stepsMap.set(step.source, step);
            const originalStep = this.getOriginalStepFromSource(selector);
            Object.assign(step.data, originalStep);
            return [step];
        } else if (result.type === DiffResultType.NODE && result.to) {
            return this.blockToSteps(result.to);
        } else {
            return [];
        }
    }
    getFieldForInnerTextResult(result : IInnerTextDiffResult) {
        if (!this.sourceEditor) {
            return null;
        }
        const targetShadow = result.bNode.parentElement;
        if (!targetShadow) {
            return null;
        }
        const targetId = targetShadow.getAttribute('id');
        if (!targetId) {
            return null;
        }
        const targetName = result.bNode.getAttribute('name');
        if (!targetName) {
            return null;
        }
        const workspace = this.sourceEditor.getWorkspace();
        const shadowBlock = workspace.getBlockById(targetId);
        if (!shadowBlock) {
            return null;
        }
        return shadowBlock.getField(targetName);
    }
    focusTarget(source : string) {
        const target = this.editor.querySelector(source);
        if (!target) {
            return;
        }
        if (target.block) {
            const block = target.block as Block;
            this.highlighter.highlight(block.svgPath_);
        } else {
            super.focusTarget(source);
        }
    }
}

registerCreator('blockly', BlocklyCreator);
