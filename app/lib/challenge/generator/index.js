import { Plugin } from '../../editor/plugin.js';
import { GeneratorAPIProvider } from './api.js';
import { labelMap, setupFieldProxy } from './label-map.js';

const GENERATOR_BLOCKS = [
    'generator_banner',
    'generator_step',
];

const DEFAULT_COPY = {
    openFlyout(label = 'this') { return `Open ${label} tray`; },
    grabBlock: 'Drag the block onto your code space',
    connect: 'Connect to this block',
    drop: 'Drop this block anywhere in your code space',
};

class Challenge extends Plugin {
    constructor() {
        super();
        this.reset();
        this.middlewares = [];
        this.blockCount = {};
        setupFieldProxy(window.Blockly);
    }
    addMiddleware(middleware) {
        this.middlewares.push(middleware);
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
        const { workspaceView, plugins } = this.editor;
        // Add middleware declared by the WorkspaceViewProvider
        if (typeof workspaceView.challengeGeneratorMiddleware === 'function') {
            this.addMiddleware(workspaceView.challengeGeneratorMiddleware);
        }
        // Add all the middlewares declared by the plugins
        plugins.forEach((plugin) => {
            if (typeof plugin.challengeGeneratorMiddleware !== 'function') {
                return;
            }
            this.addMiddleware(plugin.challengeGeneratorMiddleware);
        });
        this.setupUI();
    }
    setupUI() {
        const { workspaceToolbar } = this.editor;
        let toolboxItem;
        const GeneratorAPI = GeneratorAPIProvider(this.editor);
        GeneratorAPI.toolbox = this.creator;
        this.creatorEntry = this.editor.toolbox.addEntry(GeneratorAPI, 0);
        const toolboxItemClickCallback = () => {
            this.creator = !this.creator;
            GeneratorAPI.toolbox = this.creator;
            this.creatorEntry.update(GeneratorAPI);
            toolboxItem.updateTitle(`${this.creator ? 'Disable' : 'Enable'} creator mode`);
            toolboxItem.updateIronIcon('kwc-ui-icons:new-creation');
            if (this.creator) {
                this.addGeneratorItem();
            } else if (this.generatorItem) {
                this.removeGeneratorItem();
            }
            this.saveState();
        };
        toolboxItem = workspaceToolbar.addSettingsEntry({
            title: `${this.creator ? 'Disable' : 'Enable'} creator mode`,
            ironIcon: 'kwc-ui-icons:new-creation',
        }).on('activate', () => toolboxItemClickCallback());
        if (this.creator) {
            this.addGeneratorItem();
        }
        if (this.editor.sourceType === 'blockly') {
            const { sourceEditor } = this.editor;
            const { workspace } = sourceEditor;
            workspace.addChangeListener((event) => {
                if (!this.creator) {
                    return;
                }
                this.populateComment(event);
            });
        }
    }
    populateComment(event) {
        const { sourceEditor } = this.editor;
        const { workspace, Blockly } = sourceEditor;
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
    }
    static getDefaultCommentData() {
        const data = {
            openFlyoutCopy: DEFAULT_COPY.openFlyout(),
            grabBlockCopy: DEFAULT_COPY.grabBlock,
            connectCopy: DEFAULT_COPY.connect,
        };
        return data;
    }
    static cleanTree(node) {
        const comments = [...node.querySelectorAll('comment')];
        comments.forEach((comment) => {
            comment.parentNode.removeChild(comment);
        });
        return node;
    }
    addGeneratorItem() {
        this.generatorItem = this.editor.workspaceToolbar.addSettingsEntry({
            title: 'Generate Challenge',
            ironIcon: 'kc-ui:export',
        }).on('activate', () => this.download());
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
    addSteps(steps) {
        this.data.steps = this.data.steps.concat(steps);
    }
    runMiddlewares(data) {
        return this.middlewares.reduce((acc, middleware) => middleware(acc, this), data);
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
        const xml = Blockly.Xml.textToDom(source);
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
        /* TODO: This uses the properties inside the generator that still refers to parts
         * Think of a better way to generate block steps while being aware of their
         * parts context
         * Possible way would be to make the generator ignore composed block ids from parts
         * and scan here all the steps and all their locations to translate them to their
         * part + block equivalents
         * box#set_stroke_size => { "part": "part_0", "block": "set_stroke_size" }
         * Other option is to not transform them at all and update the challenge parser to
         * Support hashtag part syntax
         * Last option is to leave it as it is but allow the generator plugin to support two
         * types of middlewares, pre and post. We could use pre to generate the parts steps and
         * populate the id map before the generator tries to read it
         */
        if (parts) {
            parts.forEach((part) => {
                this.partsIds[part.id] = `part_${this.uid('part')}`;
                this.appParts[part.id] = part;
            });
        }
        this.data.id = Challenge.findId(xml);
        const metadata = Challenge.findMetadata(xml);
        const startOptions = Challenge.findStartNodes(xml);
        startOptions.forEach((startOption) => {
            if (!startOption.start || startOption.start.tagName === 'variables') {
                return;
            }
            this.addSteps(this.blockToSteps(startOption.start));
        });
        const rootNode = startOptions.reduce((acc, options) => {
            if (options.preloaded) {
                acc.appendChild(Challenge.cleanTree(options.preloaded));
            }
            return acc;
        }, xml.cloneNode(false));
        this.data.defaultApp = JSON.stringify({
            source: Blockly.Xml.domToText(rootNode),
        });
        this.data = this.runMiddlewares(this.data);
        // Add the metadata to the challenge
        Object.assign(this.data, metadata);
        return this.data;
    }
    static findId(xml) {
        // Find generator id block
        const idNode = xml.querySelector('block[type="generator_id"]');
        if (!idNode) {
            // Return default id if not defined
            return 'missingno';
        }
        // Extract Text field containing the id
        const textField = idNode.querySelector('field[name="ID"]');
        // Get all the id blocks and remove them from the XML tree
        const idNodes = [...xml.querySelectorAll('block[type="generator_id"]')];
        idNodes.forEach(node => node.parentNode.removeChild(node));
        // Return the contents of the text field
        return textField.innerText;
    }
    static findMetadata(xml) {
        // Find generator metadata block
        const metadataNode = xml.querySelector('block[type="generator_metadata"]');
        if (!metadataNode) {
            // Return empty object if no metadata
            return {};
        }
        // Extract Text field containing the JSON data
        const textField = metadataNode.querySelector('field[name="JSON"]');
        // Get all the id blocks and remove them from the XML tree
        const metadataNodes = [...xml.querySelectorAll('block[type="generator_metadata"]')];
        metadataNodes.forEach(node => node.parentNode.removeChild(node));
        let data;
        // Safely parse the text field contents
        try {
            data = JSON.parse(textField.innerText) || {};
        } catch (e) {
            data = {};
        }
        return data;
    }
    static findStartNodes(root) {
        const clone = root.cloneNode(true);
        const entryNodes = [...clone.children];
        return entryNodes.map((entryNode) => {
            const startNode = entryNode.querySelector('block[type="generator_start"]');
            if (!startNode) {
                return {
                    preloaded: null,
                    start: entryNode,
                    root: entryNode,
                };
            }
            const nextNode = startNode.querySelector('next>block');
            if (!nextNode) {
                startNode.parentNode.removeChild(startNode);
                return {
                    preloaded: entryNode,
                    start: null,
                    root: null,
                };
            }
            // Replace the generator block with the real first block
            startNode.parentNode.insertBefore(nextNode, startNode);
            startNode.parentNode.removeChild(startNode);
            // Tag the start of the challenge
            nextNode.setAttribute('challenge-start-node', '');
            // Create a new tree for the generator to parse
            const cleanRoot = entryNode.cloneNode(true);
            // Grab the entry point of the challenge
            const cleanStartNode = cleanRoot.querySelector('[challenge-start-node]');
            // Remove the start node from the original clone, this leaves the default blocks on
            // the workspace
            nextNode.parentNode.removeChild(nextNode);
            return {
                preloaded: entryNode,
                start: cleanStartNode,
                root: cleanRoot,
            };
        });
    }
    static generatorBlockToSteps(node) {
        const type = node.getAttribute('type');
        switch (type) {
        case 'generator_banner': {
            return Challenge.generatorBannerToSteps(node);
        }
        case 'generator_step': {
            return Challenge.generatorStepToSteps(node);
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
    static generatorStepToSteps(node) {
        const textField = node.querySelector('field[name="JSON"]');
        const jsonString = textField.innerText;
        return [JSON.parse(jsonString)];
    }
    parseComment(node) {
        let data = {};
        const commentNode = node.querySelector('comment');
        // No comment found or comment node is not direct child of node
        if (!commentNode || commentNode.parentNode !== node) {
            return data;
        }
        try {
            data = JSON.parse(commentNode.innerText);
        } catch (e) {
            this.editor.logger.warn(`Could not parse comment '${commentNode.innerText}'`);
        }
        return data;
    }
    getCategoryLabel(categoryId) {
        // FIXME: Hard coded translation for normal mode. This will disapera once modes are not a
        // thing anymore and the block names will be matching in the toolbox entries
        switch (categoryId) {
        case 'normal': {
            return 'Draw';
        }
        default: {
            const { entries } = this.editor.toolbox;
            for (let i = 0; i < entries.length; i += 1) {
                const id = entries[i].type === 'blockly' ? entries[i].id : entries[i].name;
                if (id === categoryId) {
                    const name = entries[i].type === 'blockly' ? entries[i].category.name : entries[i].verbose;
                    return name;
                }
            }
            const { addedParts } = this.editor;
            if (addedParts !== undefined) {
                for (let i = 0; i < addedParts.length; i += 1) {
                    if (addedParts[i].id === categoryId) {
                        return addedParts[i].label;
                    }
                }
            }
            return categoryId;
        }
        }
    }
    /**
     * Generate the steps matching a `field` node in a Blockly XML tree
     */
    fieldToSteps(node) {
        let parent = node.parentNode;
        let parentBlockType = Challenge.parseBlockType(parent.getAttribute('type'));
        const parentTagName = parent.tagName;
        const steps = [];
        let inputName;
        let fieldName;
        let shadowSelector;

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
            let defaults;
            let defaultLabel;
            if (fieldName) {
                if (!this.fieldDefaults[parentBlockType.block]) {
                    this.editor.logger.warn('missing default field: ', parentBlockType.block, fieldName);
                } else {
                    defaults = this.fieldDefaults[parentBlockType.block][fieldName];
                    while (typeof defaults === 'object' && 'shadow' in defaults && 'default' in defaults) {
                        defaults = defaults.default;
                    }
                    if (typeof defaults === 'object' && 'id' in defaults) {
                        defaultLabel = defaults.label || defaults.id;
                        defaults = defaults.id;
                    } else if (this.fieldDefaults[parentBlockType.block].label) {
                        defaultLabel = this.fieldDefaults[parentBlockType.block].label;
                    }
                }
            }
            const commentData = this.parseComment(parent);
            const fieldValue = this.normaliseType(node.firstChild.nodeValue);
            defaults = this.normaliseType(defaults);
            // Loose check of the value
            /* eslint eqeqeq: "off" */
            if (fieldValue != defaults) {
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
                const fieldPreviewLabel = labelMap.get(fieldValue);
                const fieldPreview = Challenge.generateFieldPreview(node, this.translate('field', fieldPreviewLabel || fieldValue));
                const currentFieldPreview = Challenge.generateFieldPreview(node, defaultLabel || defaults);
                let bannerCopy = commentData.bannerCopy || 'Change \"$currentFieldPreview\" to \"$fieldPreview\"';
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
                    // Matches a hex color value. By default any change of value for a color will be ignored
                    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(node.firstChild.nodeValue)) {
                        step.value = node.firstChild.nodeValue;
                    }
                }
                steps.push(step);
            }
        }
        return steps;
    }
    normaliseType(value) {

        if (value.length === 0) {
            return "&#160;";
        }
        value = value.length > 0 && !isNaN(value) ? parseInt(value) : value;
        switch(typeof value) {
            case 'string':
                return value.toLowerCase();
            case 'number':
                return parseInt(value);
            default:
                return value;
        }
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
            // Nothing connected to block, stop here
            if (!nextNode) {
                return steps;
            }
            // Move the next node in place of the current generator node
            node.parentNode.insertBefore(nextNode, node);
            node.parentNode.removeChild(node);
            // Continue genratin the challenge from next block
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
            openFlyoutCopy: commentData.openFlyoutCopy || DEFAULT_COPY.openFlyout(categoryLabel),
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
            step.dropCopy = commentData.dropCopy || DEFAULT_COPY.drop;
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
