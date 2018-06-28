import Plugin from '../../editor/plugin.js';
import { GeneratorAPIProvider } from './api.js';

const GENERATOR_BLOCKS = [
    'generator_banner',
];

const DEFAULT_COPY = {
    openFlyout: 'Open this tray',
    grabBlock: 'Drag the block onto your code space',
    connect: 'Connect to this block',
};

class Challenge extends Plugin {
    constructor() {
        super();
        this.reset();
    }
    reset() {
        // Namespaces for the unique ids
        this.uidNss = {};

        this.data = {};
        this.data.steps = [];
        this.data.parts = [];
        this.data.modules = [];
        this.data.variables = [];
        this.data.filterBlocks = {};

        this.appParts = {};
        this.partsIds = {};
    }
    onInstall(editor) {
        this.editor = editor;
        const { toolbox } = this.editor;
        const { renderer } = toolbox;
        this.defaults = renderer.defaults;
    }
    reloadState() {
        const stateString = localStorage.getItem('generator-state');
        if (!stateString) {
            return;
        }
        try {
            const state = JSON.parse(stateString);
            this.creator = state.creator || false;
        } catch (e) {}
    }
    saveState() {
        const state = {
            creator: this.creator,
        };
        localStorage.setItem('generator-state', JSON.stringify(state));
    }
    onInject() {
        this.reloadState();
        const { workspaceView } = this.editor;
        const root = workspaceView.root.shadowRoot || workspaceView.root;
        const frame = root.querySelector('kc-workspace-frame');
        if (!frame) {
            return;
        }
        let toolboxItem;
        const GeneratorAPI = GeneratorAPIProvider(this.editor);
        GeneratorAPI.toolbox = this.creator;
        this.creatorEntry = this.editor.toolbox.addEntry(GeneratorAPI, 0);
        const toolboxItemClickCallback = () => {
            this.creator = !this.creator;
            GeneratorAPI.toolbox = this.creator;
            this.creatorEntry.update(GeneratorAPI);
            toolboxItem.update(`${this.creator ? 'Disable' : 'Enable'} creator mode`, 'kwc-ui-icons:new-creation', toolboxItemClickCallback);
            if (this.creator) {
                this.addGeneratorItem(frame);
            } else if (this.generatorItem) {
                this.removeGeneratorItem();
            }
            this.saveState();
        };
        toolboxItem = frame.addMenuOption(`${this.creator ? 'Disable' : 'Enable'} creator mode`, 'kwc-ui-icons:new-creation', toolboxItemClickCallback);
        if (this.creator) {
            this.addGeneratorItem(frame);
        }
        if (this.editor.sourceType === 'blockly') {
            const { sourceEditor } = this.editor;
            const { workspace, Blockly } = sourceEditor;
            workspace.addChangeListener((event) => {
                if (!this.creator) {
                    return;
                }
                if (event.type !== Blockly.Events.UI) {
                    return;
                }
                if (event.element !== 'commentOpen') {
                    return;
                }
                const block = workspace.getBlockById(event.blockId);
                const { comment } = block;
                if (!comment) {
                    return;
                }
                const text = comment.getText();
                if (text === '') {
                    comment.setText(JSON.stringify(Challenge.getDefaultCommentData(), null, '    '));
                }
            });
        }
    }
    static getDefaultCommentData() {
        const data = {
            openFlyoutCopy: DEFAULT_COPY.openFlyout,
            grabBlockCopy: DEFAULT_COPY.grabBlock,
            connectCopy: DEFAULT_COPY.connect,
        };
        return data;
    }
    addGeneratorItem(frame) {
        this.generatorItem = frame.addMenuOption('Generate Challenge', 'kc-ui:export', () => {
            this.download();
        });
    }
    removeGeneratorItem() {
        if (!this.generatorItem) {
            return;
        }
        this.generatorItem.dispose();
    }
    download() {
        const data = this.generate();
        const link = document.createElement('a');
        link.href = `data:application/json,${encodeURIComponent(JSON.stringify(data, null, '    '))}`;
        link.download = 'challenge.json';
        link.click();
    }
    translate(type, key) {
        let result = this._translate(type, key);
        if (result === key) {
            if (type === 'category') {
                result = this.appParts[key] && this.appParts[key].name ?
                    this.appParts[key].name : result;
            }
        }
        return result;
    }
    uid(ns) {
        if (typeof this.uidNss[ns] === 'undefined') {
            this.uidNss[ns] = 0;
            return this.uidNss[ns];
        }
        this.uidNss[ns] += 1;
        return this.uidNss[ns];
    }
    generatePartsSteps(parts) {
        parts.forEach((part) => {
            if (this.data.parts.indexOf(part.type) === -1) {
                this.data.parts.push(part.type);
            }
            this.partsIds[part.id] = `part_${this.uid('part')}`;
            this.appParts[part.id] = part;

            this.data.steps.push({
                type: 'create-part',
                part: part.type,
                alias: this.partsIds[part.id],
                openPartsCopy: '<OPEN PARTS DIALOG>',
                addPartCopy: '<ADD PART>',
            });
        });
    }
    addSteps(steps) {
        this.data.steps = this.data.steps.concat(steps);
    }
    generate() {
        this.reset();
        // TODO: Support more than one sourceType
        if (this.editor.sourceType !== 'blockly') {
            return {};
        }
        const { sourceEditor } = this.editor;
        const { Blockly } = sourceEditor;
        const app = this.editor.save();
        const { source, parts, mode } = app;
        const fullMode = this.editor.getMode();
        const xml = Blockly.Xml.textToDom(source);
        const defaultXml = Blockly.Xml.textToDom(fullMode.defaultSource || fullMode.defaultBlocks);
        this.data.mode = mode;
        this.fieldDefaults = {};
        Object.keys(this.defaults.values).forEach((blockId) => {
            this.fieldDefaults[blockId] = {};
            const block = this.defaults.values[blockId];
            if (!block) {
                return;
            }
            Object.keys(block).forEach((fieldId) => {
                if (block[fieldId].default) {
                    this.fieldDefaults[blockId][fieldId] = block[fieldId].default;
                } else {
                    this.fieldDefaults[blockId][fieldId] = block[fieldId];
                }
            });
        });
        // TODO: Defer that to the parts plugin
        if (parts) {
            this.generatePartsSteps(parts);
        }
        const startOptions = Challenge.findStartNode(xml);
        if (startOptions) {
            this.addSteps(this.blockToSteps(startOptions.start));
            this.data.defaultApp = Blockly.Xml.domToText(startOptions.preloaded);
        } else {
            const defaultBlocksSteps = this.matchDefaultBlocks(xml.children, defaultXml.children);
            this.addSteps(defaultBlocksSteps);
        }
        this.data.steps.push({
            banner: {
                text: 'You can now test the app',
                next_button: true,
            },
            beacon: {
                target: 'banner-button',
                offset: 0,
            },
        });
        return this.data;
    }
    static findStartNode(root) {
        const clone = root.cloneNode(true);
        const startNode = clone.querySelector('block[type="generator_start"]');
        if (startNode) {
            const nextNode = startNode.querySelector('next>block');
            // Replace the generator block with the real first block
            startNode.parentNode.insertBefore(nextNode, startNode);
            startNode.parentNode.removeChild(startNode);
            // Tag the start of the challenge
            nextNode.setAttribute('challenge-start-node', '');
            // Create a new tree for the generator to parse
            const cleanRoot = clone.cloneNode(true);
            // Grab the entry point of the challenge
            const cleanStartNode = cleanRoot.querySelector('[challenge-start-node]');
            // Remove the start node from the original clone, this leaves the default blocks on
            // the workspace
            nextNode.parentNode.removeChild(nextNode);
            return {
                preloaded: clone,
                start: cleanStartNode,
                root: cleanRoot,
            };
        }
        return null;
    }
    matchDefaultBlocks(blocks, defaultBlocks) {
        let steps = [];
        const appChildren = [...blocks].filter(block => block.tagName !== 'variables');
        for (let i = 0; i < appChildren.length; i += 1) {
            steps = steps.concat(this.matchDefaultNode(appChildren[i], defaultBlocks[i]));
        }
        return steps;
    }
    matchDefaultNode(node, defaultNode) {
        let steps = [];
        switch (node.tagName) {
        /**
         * Compare the blocks. Jump to children if they match, add a delete step
         * to remove the existing the default block
         * if the block from the challenge is different from the one defined in the mode
         */
        case 'block': {
            if (!defaultNode) {
                steps = steps.concat(this.blockToSteps(node));
            } else if (node.getAttribute('type') === defaultNode.getAttribute('type') &&
                    node.getAttribute('id') === defaultNode.getAttribute('id')) {
                steps = steps.concat(this.matchDefaultBlocks(node.children, defaultNode.children));
            } else {
                steps.push({
                    tooltips: [{
                        text: "You can remove this block we won't need it for this app",
                        position: 'right',
                        location: {
                            block: {
                                rawId: defaultNode.getAttribute('id'),
                            },
                        },
                    }],
                    arrow: {
                        target: 'blockly-bin',
                        angle: 210,
                        size: 80,
                    },
                    validation: {
                        blockly: {
                            delete: {
                                target: {
                                    rawId: defaultNode.getAttribute('id'),
                                },
                            },
                        },
                    },
                });
                steps = steps.concat(this.blockToSteps(node));
            }
            break;
        }
        /**
         * Adds a change step if the value is different
         */
        case 'field': {
            if (node.firstChild.nodeValue !== defaultNode.firstChild.nodeValue) {
                steps = steps.concat(this.fieldToSteps(node, defaultNode.firstChild.nodeValue));
            }
            break;
        }
        case 'statement': {
            if (defaultNode) {
                const stSteps = this.matchDefaultNode(node.firstChild, defaultNode.firstChild);
                steps = steps.concat(stSteps);
            }
            if (node) {
                steps = steps.concat(this.blockToSteps(node.firstChild));
            }
            break;
        }
        case 'next': {
            if (!defaultNode) {
                steps = steps.concat(this.blockToSteps(node.firstChild));
            } else {
                const nextSteps = this.matchDefaultNode(node.firstChild, defaultNode.firstChild);
                steps = steps.concat(nextSteps);
            }
            break;
        }
        default: {
            break;
        }
        }
        return steps;
    }
    static generatorBlockToSteps(node) {
        const type = node.getAttribute('type');
        switch (type) {
        case 'generator_banner': {
            return Challenge.generatorBannerToSteps(node);
        }
        default: {
            return [];
        }
        }
    }
    static generatorBannerToSteps(node) {
        const textField = node.querySelector('field[name="TEXT"]');
        const text = textField.innerText;
        return [{
            banner: {
                text,
                next_button: true,
            },
        }];
    }
    parseComment(node) {
        const commentNode = node.getElementsByTagName('comment')[0];
        let data = {};
        if (commentNode) {
            try {
                data = JSON.parse(commentNode.innerText);
            } catch (e) {
                this.editor.logger.warn(`Could not parse comment '${commentNode.innerText}'`);
            }
        }
        return data;
    }
    getCategoryLabel(categoryId) {
        const { entries } = this.editor.toolbox;
        for (let i = 0; i < entries.length; i += 1) {
            const id = entries[i].type === 'blockly' ? entries[i].id : entries[i].name;
            if (id === categoryId) {
                const name = entries[i].type === 'blockly' ? entries[i].category.name : entries[i].verbose;
                return name;
            }
        }
        const { addedParts } = this.editor;
        for (let i = 0; i < addedParts.length; i += 1) {
            if (addedParts[i].id === categoryId) {
                return addedParts[i].label;
            }
        }
        return categoryId;
    }
    /**
     * Generate the steps matching a `field` node in a Blockly XML tree
     */
    fieldToSteps(node, fieldDefault) {
        let parent = node.parentNode;
        let parentBlockType = Challenge.parseBlockType(parent.getAttribute('type'));
        const parentTagName = parent.tagName;
        const steps = [];
        let fieldValue;
        let inputName;
        let fieldName;
        let shadowSelector;
        let defaults = fieldDefault;

        let ptag = parentTagName;
        let absParent = parent;
        // Lookup the absolute parent. We can have a chain of nested shadow block
        // and need to build the shadow selector
        // from the parent block
        while (ptag !== 'block') {
            absParent = absParent.parentNode;
            ptag = absParent.tagName;
            if (ptag === 'value') {
                if (!shadowSelector) {
                    shadowSelector = absParent.getAttribute('name');
                } else {
                    shadowSelector = {
                        name: absParent.getAttribute('name'),
                        shadow: shadowSelector.shadow || shadowSelector,
                    };
                }
            }
        }

        if (parentBlockType.block === 'variables_set' && this.data.variables.indexOf(node.firstChild.nodeValue) === -1) {
            this.data.variables.push(node.firstChild.nodeValue);
        }
        if (!!node.firstChild && node.firstChild.nodeValue !== null) {
            if (parentTagName === 'shadow') {
                inputName = parent.parentNode.getAttribute('name');
                fieldName = inputName;
                parent = parent.parentNode.parentNode;
                parentBlockType = Challenge.parseBlockType(parent.getAttribute('type'));
            } else {
                fieldName = node.getAttribute('name');
            }
            if (fieldName && !defaults) {
                if (!this.fieldDefaults[parentBlockType.block]) {
                    this.editor.logger.warn('missing default field: ', parentBlockType.block, fieldName);
                } else {
                    defaults = this.fieldDefaults[parentBlockType.block][fieldName];
                    while (typeof defaults === 'object' && 'shadow' in defaults && 'default' in defaults) {
                        defaults = defaults.default;
                    }
                }
            }
            const commentData = this.parseComment(parent);
            // Loose check of the value
            /* eslint eqeqeq: "off" */
            if (node.firstChild.nodeValue != defaults) {
                const challengeId = absParent.getAttribute('challengeId');
                const rawId = absParent.getAttribute('id');
                const selector = {
                    shadow: shadowSelector,
                };
                if (challengeId) {
                    selector.id = challengeId;
                } else {
                    selector.rawId = rawId;
                }
                fieldValue = this.translate('field', node.firstChild.nodeValue);
                const fieldPreview = Challenge.generateFieldPreview(node, fieldValue);
                const currentFieldPreview = Challenge.generateFieldPreview(node, fieldDefault);
                let bannerCopy = commentData.bannerCopy || 'Change $currentFieldPreview to $fieldPreview';
                bannerCopy = bannerCopy.replace(/\$fieldPreview/g, fieldPreview);
                bannerCopy = bannerCopy.replace(/\$currentFieldPreview/g, currentFieldPreview);
                // Add a `change value` step to get the right value
                const uiLocation = Object.assign({ inputName: fieldName }, selector);
                const step = {
                    type: 'change-input',
                    block: uiLocation,
                    bannerCopy,
                };
                const ignoreInputs = typeof commentData.ignoreInputs === 'undefined' ? [] : commentData.ignoreInputs;
                // Ignore Inputs set to true will ignore all inputs.
                // Otherwise use the array to check which inputs to ignore
                if ((Array.isArray(ignoreInputs) && ignoreInputs.indexOf(fieldName) === -1)
                    || (!Array.isArray(ignoreInputs) && ignoreInputs !== true)) {
                    step.value = node.firstChild.nodeValue;
                }
                steps.push(step);
            }
        }
        return steps;
    }
    /**
     * Generate the steps matching a `block` node in a Blockly XML tree
     */
    blockToSteps(node) {
        // Defines the location of the toolbox category.
        // Can be the category itself or from a previously added part
        const blockChallengeId = `block_${this.uid('block')}`;
        const type = node.getAttribute('type');
        const blockType = Challenge.parseBlockType(type);
        let steps = [];
        let parent = node.parentNode;
        let categoryLocation;
        let blockLocation;
        let categoryLabel;
        let inputName;

        if (GENERATOR_BLOCKS.indexOf(type) !== -1) {
            steps = steps.concat(Challenge.generatorBlockToSteps(node));
            const nextNode = node.querySelector('next>block');
            // Move the next node in place of the current generator node
            node.parentNode.insertBefore(nextNode, node);
            node.parentNode.removeChild(node);
            return steps.concat(this.blockToSteps(nextNode));
        }

        node.setAttribute('challengeId', blockChallengeId);

        const parentTagName = parent.tagName;

        // The block from the original app isn't from a created part,
        // thus doens't contain a category field
        if (!blockType.category) {
            blockType.category = this.defaults.categoryMap.get(blockType.block);
            categoryLocation = blockType.category;
            blockLocation = blockType.block;
            if (this.data.modules.indexOf(blockType.category) === -1) {
                this.data.modules.push(blockType.category);
            }
        } else if (this.partsIds[blockType.category]) {
            blockLocation = {
                part: this.partsIds[blockType.category],
                type: blockType.block,
            };
            categoryLocation = {
                part: blockLocation.part,
            };
        } else {
            blockLocation = type;
            categoryLocation = blockType.category;
        }

        // Adds the block to the whitelist
        this.data.filterBlocks[blockType.category] =
            this.data.filterBlocks[blockType.category] || [];
        if (this.data.filterBlocks[blockType.category].indexOf(blockType.block) === -1) {
            this.data.filterBlocks[blockType.category].push(blockType.block);
        }

        categoryLabel = this.getCategoryLabel(blockType.category);
        if (categoryLabel !== blockType.category) {
            categoryLabel = `the ${categoryLabel}`;
        } else {
            categoryLabel = 'this';
        }

        const commentData = this.parseComment(node);

        const step = {
            type: 'create-block',
            openFlyoutCopy: commentData.openFlyoutCopy || DEFAULT_COPY.openFlyout,
            grabBlockCopy: commentData.grabBlockCopy || DEFAULT_COPY.grabBlock,
            category: categoryLocation,
            blockType: blockLocation,
            alias: blockChallengeId,
        };

        if (parentTagName === 'next') {
            parent = parent.parentNode;
        } else if (parentTagName === 'statement' || parentTagName === 'value') {
            inputName = parent.getAttribute('name');
            parent = parent.parentNode;
        } else {
            parent = null;
        }

        if (parent) {
            let shadow;
            let connectionTargetNode = parent;
            if (parent.tagName === 'shadow') {
                const valueNode = parent.parentNode;
                if (valueNode.tagName === 'value') {
                    shadow = valueNode.getAttribute('name');
                    connectionTargetNode = valueNode.parentNode;
                }
            }
            step.connectCopy = commentData.connectCopy || DEFAULT_COPY.connect;
            const connectTo = {
                shadow,
                inputName,
            };
            const challengeId = connectionTargetNode.getAttribute('challengeId');
            if (challengeId) {
                connectTo.id = challengeId;
            } else {
                connectTo.rawId = connectionTargetNode.getAttribute('id');
            }
            step.connectTo = connectTo;
        } else {
            step.dropCopy = 'Drop anywhere in the code';
        }

        steps.push(step);

        for (let i = 0; i < node.children.length; i += 1) {
            steps = steps.concat(this.nodeToSteps(node.children[i]));
        }

        return steps;
    }
    /**
     * Generate the steps matching a `value` node in a Blockly XML tree
     */
    valueToSteps(node) {
        let steps = [];
        let child;
        for (let i = 0; i < node.children.length; i += 1) {
            if (node.children[i].tagName === 'block') {
                child = node.children[i];
                break;
            }
        }
        if (!child) {
            child = node.firstChild;
        }
        steps = steps.concat(this.nodeToSteps(child));

        return steps;
    }

    nodeToSteps(node) {
        let steps = [];
        let child;
        let i;

        switch (node.tagName) {
        case 'field': {
            steps = steps.concat(this.fieldToSteps(node));
            break;
        }
        case 'next':
        case 'value': {
            steps = steps.concat(this.valueToSteps(node));
            break;
        }
        case 'statement': {
            steps = steps.concat(this.nodeToSteps(node.firstChild));
            break;
        }
        case 'shadow': {
            for (i = 0; i < node.children.length; i += 1) {
                child = node.children[i];
                steps = steps.concat(this.nodeToSteps(child));
            }
            break;
        }
        case 'block': {
            steps = steps.concat(this.blockToSteps(node));
            break;
        }
        default: {
            break;
        }
        }
        return steps;
    }
    static generateFieldPreview(node, fieldValue) {
        return `<kano-value-preview><span>${fieldValue}</span></kano-value-preview>`;
    }
    static parseBlockType(type) {
        const pieces = type.split('#');
        const result = {};
        if (pieces.length > 1) {
            [result.category, result.block] = pieces;
        } else {
            [result.block] = pieces;
        }
        return result;
    }
    _translate(type, key) {
        return this.defaults.labels[type] && this.defaults.labels[type][key] ?
            this.defaults.labels[type][key] : key;
    }
    static createFromApp(app) {
        const challenge = new Challenge();
        challenge.loadFromApp(app);
        return challenge;
    }
}
export { Challenge };
export default Challenge;
