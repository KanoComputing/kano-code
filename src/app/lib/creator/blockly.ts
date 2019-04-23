import { Creator, IStepData, IGeneratedStep } from './creator.js';
import { BlocklySourceEditor } from '../editor/source-editor/blockly.js';
import { Xml, BlockSvg } from '@kano/kwc-blockly/blockly.js';
import { BlocklyCreatorToolbox } from './blockly/toolbox.js';
import { findStartNodes, getAncestor } from './blockly/xml.js';
import BlocklyMetaRenderer from '../meta-api/renderer/blockly.js';

const CUSTOM_BLOCKS = ['generator_step'];

export class BlocklyCreator extends Creator {
    sourceEditor? : BlocklySourceEditor;
    nodeMap : Map<HTMLElement, IGeneratedStep> = new Map();
    aliasCounter : number = -1;
    createAlias() {
        this.aliasCounter += 1;
        return `block_${this.aliasCounter}`;
    }
    onInject() {
        this.editor.toolbox.addEntry(BlocklyCreatorToolbox, 0);
        this.sourceEditor = this.editor.sourceEditor as BlocklySourceEditor;
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
    getConnectionForStatement(block : HTMLElement) {
        const statement = getAncestor(block, b => b.tagName.toLowerCase() === 'statement' || b.tagName.toLowerCase() === 'value');
        if (!statement) {
            return null;
        }
        const name = statement.getAttribute('name');
        const parentBlock = getAncestor(statement, b => b.tagName.toLowerCase() === 'block') as HTMLElement;
        if (!parentBlock) {
            return null;
        }
        const step = this.nodeMap.get(parentBlock);
        if (!step) {
            return {
                name,
                id: parentBlock.getAttribute('id'),
            };
        }
        return {
            name,
            parentStep: step,
        };
    }
    generateConnectionQuery(result : any) {
        let connectionQuery = null;
        if (result.parentStep) {
            // There is a parent step found, get the alias
            connectionQuery = `alias#${result.parentStep.data.alias}>input#${result.name}`;
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
        if (type === 'generator_step') {
            const field = block.querySelector('field[name="JSON"]') as HTMLElement;
            const dataString = field.innerText;
            let data = {};
            try {
                data = JSON.parse(dataString);
            } catch(e) {}
            const customStep = {
                source: `block#${id}`,
                data,
            };
            let steps = [customStep];
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
        let parentConnection = this.getConnectionForStatement(block);
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
        return [];
    }
}
