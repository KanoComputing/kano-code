import { Creator, IGeneratedStep } from '../../creator/creator.js';
import { BlocklySourceEditor } from '../blockly.js';
import { Xml, Block } from '@kano/kwc-blockly/blockly.js';
import { BlocklyCreatorToolbox } from './creator/toolbox.js';
import { findStartNodes, getAncestor, parseXml, findFirstTreeDiff, DiffResultType, nodeIsNonShadowStatementOrValue } from './creator/xml.js';
import BlocklyMetaRenderer from './api-renderer.js';
import { runMiddleware } from '../../creator/util.js';
import { SourceEditor } from '../source-editor.js';

const CUSTOM_BLOCKS = ['generator_step', 'generator_banner', 'generator_id'];

function isBlocklySourceEditor(sourceEditor : SourceEditor) : sourceEditor is BlocklySourceEditor {
    return sourceEditor.editor.sourceType === 'blockly';
}

interface IConnectionInfo {
    name : string;
    parentStep? : IGeneratedStep;
    id? : string;
}

export class BlocklyCreator extends Creator {
    sourceEditor? : BlocklySourceEditor;
    nodeMap : Map<HTMLElement, IGeneratedStep> = new Map();
    aliasCounter : number = -1;
    createAlias() {
        this.aliasCounter += 1;
        return `block_${this.aliasCounter}`;
    }
    onInject() {
        super.onInject();
        this.editor.toolbox.addEntry(BlocklyCreatorToolbox, 0);
        if (isBlocklySourceEditor(this.editor.sourceEditor)) {
            this.sourceEditor = this.editor.sourceEditor;
        }
    }
    generate() {
        this.aliasCounter = -1;
        let steps : IGeneratedStep[] = super.generate();
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
            steps = steps.concat(this.blockToSteps(startOption.start));
        });
        
        return steps;
    }
    getConnectionForStatementOrValue(block : HTMLElement) : IConnectionInfo|null {
        // Find the statement or value node that hosts the block. Make sure to not accept statements or values inside a shadow block
        const input = getAncestor(block, b => nodeIsNonShadowStatementOrValue(b));
        if (!input) {
            return null;
        }
        // Retrieve the name of the input
        const name = input.getAttribute('name')!;
        // Find the input's parent block
        const parentBlock = getAncestor(input, b => b.tagName.toLowerCase() === 'block') as HTMLElement;
        // Bail out if it doesn't have a parent
        if (!parentBlock) {
            return null;
        }
        // Retrieve the step that created this parent block
        const step = this.nodeMap.get(parentBlock);
        // No step means the block is in the default app, in that case return the id of the parent block
        if (!step) {
            return {
                name,
                id: parentBlock.getAttribute('id')!,
            };
        }
        return {
            name,
            parentStep: step,
        };
    }
    generateConnectionQuery(result : IConnectionInfo) {
        let connectionQuery = null;
        if (result.parentStep) {
            const stepData = result.parentStep.data;
            const middleware = this.middlewares.get(result.parentStep.source);
            const data = runMiddleware(stepData, middleware);
            // There is a parent step found, get the alias
            connectionQuery = `alias#${data.alias}>input#${result.name}`;
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
                data: {},
            };
            steps.push(customStep);
            const next = block.querySelector('next') as HTMLElement;
            if (next) {
                steps = steps.concat(this.nodeToSteps(next));
            }
            return steps;
        } else if (type === 'generator_banner') {
            const field = block.querySelector('field[name="TEXT"]') as HTMLElement;
            if (field) {
                steps.push({
                    source: `block#${id}`,
                    data: {
                        banner: field.innerText,
                    },
                });
            }
            const next = block.querySelector('next') as HTMLElement;
            if (next) {
                steps = steps.concat(this.nodeToSteps(next));
            }
            return steps;
        }
        return [];
    }
    blockToSteps(block : HTMLElement) : IGeneratedStep[] {
        const renderer = this.editor.toolbox.renderer as BlocklyMetaRenderer;
        const type = block.getAttribute('type');
        const id = block.getAttribute('id');
        if (!type) {
            return [];
        }
        // Handle the blocks from the generator categiry separately
        if (CUSTOM_BLOCKS.indexOf(type) !== -1) {
            return this.customBlockToSteps(block);
        }
        // Find the toolbox entry that matches this block type
        const entry = renderer.getEntryForBlock(type);
        if (!entry) {
            return [];
        }
        // Resolve an eventual parent connection
        let connectionQuery = null;
        let parentConnection = this.getConnectionForStatementOrValue(block);
        if (parentConnection) {
            connectionQuery = this.generateConnectionQuery(parentConnection);
        }
        // This is the actual step generated
        const createBlockStep : IGeneratedStep = {
            source: `block#${id}`,
            data: {
                type: 'create-block',
                category: entry.def.name,
                blockType: type,
                alias: this.createAlias(),
                openFlyoutCopy: `Open the ${entry.getVerboseDisplay()} tray`,
                grabBlockCopy: 'Pick up the block with your mouse or finger and drag it into the middle',
            },
        };
        // The connect field is only added when a connection is required
        if (connectionQuery) {
            createBlockStep.data.connect = connectionQuery;
            createBlockStep.data.connectCopy = 'Connect please';
        } else {
            createBlockStep.data.dropCopy = 'Drop it onto your code space to add it into your program.';
        }
        // Keep track of that new step, map it to its source block.
        this.nodeMap.set(block, createBlockStep);
        let blockSteps : IGeneratedStep[] = [createBlockStep];
        // Go through all blocks and generated their steps
        for (const child of block.children) {
            blockSteps = blockSteps.concat(this.nodeToSteps(child as HTMLElement));
        }
        return blockSteps;
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
    shadowToSteps(parent : HTMLElement, inputName : string, shadow : HTMLElement) : IGeneratedStep[] {
        const parentType = parent.getAttribute('type');
        const id = shadow.getAttribute('id');
        if (!parentType) {
            return [];
        }
        const renderer = this.editor.toolbox.renderer as BlocklyMetaRenderer;
        const defaults = renderer.getShadowForBlock(parentType);
        const shadowString = defaults[inputName];
        if (!shadowString) {
            console.warn(`Could not infer challenge step in shadow block: Missing default definition for input '${inputName}' in block '${parentType}'`);
        }
        const shadowTree = parseXml(shadowString);
        const result = findFirstTreeDiff(shadowTree.documentElement, shadow);
        if (result.type === DiffResultType.INNER_TEXT) {
            const parentStep = this.nodeMap.get(parent);
            let target;
            // This comes from a default block, point to the block using its id
            if (!parentStep) {
                target = `block#${id}`;
            } else {
                target = `alias#${parentStep.data.alias}>input#${inputName}`;
            }
            const step = {
                source: `block#${id}`,
                data: {
                    type: 'change-input',
                    target,
                    value: result.to,
                    bannerCopy: `Change the strength from <kano-value-preview><span>${result.from}</span></kano-value-preview> to <kano-value-preview><span>${result.to}</span></kano-value-preview>`,
                },
            };
            return [step];
        } else if (result.type === DiffResultType.NODE && result.to) {
            return this.blockToSteps(result.to);
        } else {
            return [];
        }
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
