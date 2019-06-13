import { MetaModule, Meta, MetaVariable, MetaFunction, IMetaRenderer, ICategory, MetaParameter } from '../../meta-api/module.js';
import { walkUpstream } from '../../util/blockly.js';
import { Block, FieldTextInput } from '@kano/kwc-blockly/blockly.js';
import { resolveLegacyShadowTree, resolveShadowTree } from './shadow.js';

export type IBlocklyCategory = ICategory & {
    blocks : any[];
    order? : number;
}

interface ILegacyModule {
    def : {
        register(Blockly : any) : void;
        defaults : any;
        category : IBlocklyCategory;
    };
}

interface IBlockDefaults {
    [K : string] : {
        shadow : string | null;
        value : any;
    }
}

interface IRenderedBlock {
    id : string;
    toolbox : boolean;
    defaults? : IBlockDefaults;
    register(Blockly : any) : void;
}

/**
 * Holds the definitions associated with their generated blocks
 * Used to retrieve on the fly the definition for a given block
 */
const definitionsMap : Map<string, Meta> = new Map();

export class BlocklyMetaRenderer implements IMetaRenderer {
    public defaultsMap : Map<string, IBlockDefaults> = new Map();
    public blocksMap : Map<string, MetaModule> = new Map();
    public blockIdsMap : Map<string, string> = new Map();
    public legacyBlocksMap : Map<string, ILegacyModule> = new Map();
    getEntryForBlock(blockType : string) {
        return this.blocksMap.get(blockType);
    }
    getDefaultsForBlock(blockType : string) {
        return this.defaultsMap.get(blockType);
    }
    getIdForBlock(blockType : string) {
        return this.blockIdsMap.get(blockType);
    }
    getSymbolForBlock(blockType : string, blockId : string) {
        const entry = this.getEntryForBlock(blockType);
        if (entry && entry.symbols) {
            const blockDef = entry.symbols.find(sym => sym.def.id === blockId);
            return blockDef ? blockDef.def.name : blockId;
        }
        return blockId;
    }
    renderLegacyToolboxEntry(mod : ILegacyModule, whitelist : string[]|null) {
        mod.def.register(Blockly);
        if (!mod.def.category) {
            return null;
        }
        const category = Object.assign({}, mod.def.category);
        if (whitelist) {
            category.blocks = category.blocks.filter((block : any) => {
                let id = block.id || block;
                id = id.replace(/^[^#]+(#)/g, '');
                return whitelist.indexOf(id) !== -1;
            });
        }
        category.blocks = category.blocks.map((blockOrId) => typeof blockOrId === 'string' ? { id: blockOrId } : blockOrId);
        category.blocks.forEach((block) => {
            const blockDefaults = mod.def.defaults[block.id] || {} as any;
            const defaults = {} as any;
            Object.keys(blockDefaults).forEach((input) => {
                if (typeof blockDefaults[input] !== 'undefined') {
                    defaults[input] = {
                        value: blockDefaults[input],
                        shadow: resolveLegacyShadowTree(blockDefaults[input]),
                    };
                }
            });
            block.shadow = this.shadowForDefaults(defaults);
            this.defaultsMap.set(block.id, defaults);
        });
        category.blocks.forEach((block) => {
            // Create fake module with mapped data from legacy category
            const entry = new MetaModule({ name: category.id, verbose: category.name, color: category.colour, type: 'module' });
            this.blocksMap.set(block.id, entry);
        });
        return category as ICategory;
    }
    shadowForDefaults(defaults : IBlockDefaults) {
        // Generate the shadow map for each input
        return Object.keys(defaults).reduce((acc : any, input : string) => {
            if (defaults[input] && defaults[input].shadow) {
                acc[input] = defaults[input].shadow;
            }
            return acc;
        }, {} as any);
    }
    renderToolboxEntry(mod : MetaModule, whitelist : string[]|null) {
        // Legacy module signature
        if (mod.def.type && mod.def.type === 'blockly') {
            return this.renderLegacyToolboxEntry(mod as unknown as ILegacyModule, whitelist);
        }
        // Mark all whitelisted symbols as disabled
        if (mod.symbols) {
            mod.symbols.forEach((sym) => {
                sym.def.disabled = !!(whitelist && whitelist.indexOf(sym.def.name) === -1);
            });
        }

        // Render blocks from symbols
        const blocks = this.render(mod);

        // Prepare a register method to let Blockly know of those new blocks
        // TODO: Make that a re-usable bit that rpovide a disposable resource
        const register = (Blockly : any) => {
            blocks.forEach((block : any) => block.register(Blockly));
        };

        // Exclude blocks that are excluded from the toolbox
        let filteredBlocks = blocks.filter((block : any) => block.toolbox);

        // Create the category compatible with kwc-blockly
        const category = {
            name: mod.getVerboseDisplay(),
            id: mod.def.name,
            colour: mod.getColor(),
            blocks: filteredBlocks.map((block : IRenderedBlock) => {
                const defaults = block.defaults || {} as IBlockDefaults;
                this.defaultsMap.set(block.id, defaults);
                // Generate the shadow map for each input
                const shadow = this.shadowForDefaults(defaults);
                return { id: block.id, shadow };
            }),
        };

        // Effectively register the new blocks
        register(Blockly);
        // Keep a reference to the blocks for outside reference
        category.blocks.forEach((block) => {
            this.blocksMap.set(block.id, mod);
            if (!mod || !mod.symbols) {
                return;
            }
            const sym = mod.symbols.find(sym => {
                let idToCheck = sym.def.whitelistException ? this.checkIfGetterOrSetter(block.id) : block.id;
                return BlocklyMetaRenderer.getId(sym) === idToCheck;
            });
            const id : string = sym ? sym.def.name : 'something wrong';
            this.blockIdsMap.set(block.id, id)
        });
        return category as ICategory;
    }
    checkIfGetterOrSetter(blockType : string) : string {
        const endOfBlock = blockType.slice(-4);
        if (endOfBlock === '_get' || endOfBlock === '_set') {
            return blockType.slice(0, -4);
        }
        return blockType;
    }
    disposeToolboxEntry(category : ICategory) {

    }
    render(m : MetaModule) : IRenderedBlock[] {
        switch (m.def.type) {
            case 'module': {
                return this.renderModule(m);
            }
            case 'variable': {
                return BlocklyMetaRenderer.renderVariable(m as MetaVariable);
            }
            case 'function': {
                return this.renderFunction(m as MetaFunction);
            }
            default: {
                break;
            }
        }
        return [];
    }
    renderModule(m : MetaModule) {
        if (!m.symbols) {
            return [];
        }
        return m.symbols.reduce((acc, sym) => {
            const rendered = this.render(sym);
            return acc.concat(rendered);
        }, [] as IRenderedBlock[]);
    }
    static getId(m : Meta) : string {
        let id = m.getNameChain();
        const root = m.getRoot();
        const blocklyConf = root.def.blockly;
        if (blocklyConf && blocklyConf.idPrefix) {
            id = `${blocklyConf.idPrefix}${id}`;
        }
        return id;
    }
    static renderVariable(m : MetaVariable) : IRenderedBlock[] {
        const blocks : IRenderedBlock[] = [];
        if (m.def.setter) {
            blocks.push(BlocklyMetaRenderer.renderSetter(m));
        }
        // Add a getter by default, but ignore if it is set explicitely to false
        if (typeof m.def.getter === 'undefined' || m.def.getter) {
            blocks.push(BlocklyMetaRenderer.renderGetter(m));
        }
        return blocks;
    }
    static verboseWithPrefix(m : Meta) {
        const root = m.getRoot();
        const verbose = m.getVerboseDisplay();
        if (!root.def.blockly || !root.def.blockly.prefix) {
            return verbose;
        }
        // Only apply the prefix if the block/field has a name
        return verbose.length ? `${root.def.blockly.prefix} ${verbose}` : '';
    }
    static renderGetter(m : MetaVariable) : IRenderedBlock {
        const id = `${BlocklyMetaRenderer.getId(m)}_get`;
        const register = (Blockly : any) => {
            Blockly.Blocks[id] = {
                init() {
                    this.appendDummyInput()
                        .appendField(BlocklyMetaRenderer.verboseWithPrefix(m));
                    this.setColour(m.getColor());
                    this.setOutput(BlocklyMetaRenderer.parseType(m.getReturnType()));
                    // Allow the api to customise the block further
                    if (m.def.blockly && typeof m.def.blockly.postProcess === 'function') {
                        m.def.blockly.postProcess(this);
                    }
                },
            };
            Blockly.JavaScript[id] = (block : Block) => {
                if (m.def.blockly && m.def.blockly.scope) {
                    const result = this.findScopedArgument(block, m.def.blockly.scope);
                    if (result) {
                        return [result, Blockly.JavaScript.ORDER_ATOMIC];
                    }
                }
                return [m.getNameChain('.'), Blockly.JavaScript.ORDER_FUNCTION_CALL];
            };
        };
        const toolbox = BlocklyMetaRenderer.isInToolbox(m);
        return { register, id, toolbox };
    }
    static renderSetter(m : MetaVariable) : IRenderedBlock {
        const id = `${BlocklyMetaRenderer.getId(m)}_set`;
        const blocklyName = m.def.name.toUpperCase();
        const input = BlocklyMetaRenderer.parseInputType(m.def.returnType, m);
        const register = (Blockly : any) => {
            Blockly.Blocks[id] = {
                init() {
                    if (input.type === 'field_dropdown') {
                        this.appendDummyInput(blocklyName)
                            .appendField(BlocklyMetaRenderer.verboseWithPrefix(m), 'PREFIX')
                            .appendField(new Blockly.FieldDropdown(m.def.enum), blocklyName);
                    } else {
                        this.appendValueInput(blocklyName)
                            .appendField(BlocklyMetaRenderer.verboseWithPrefix(m), 'PREFIX')
                            .setCheck(input.check);
                    }
                    this.setColour(m.getColor());
                    this.setPreviousStatement(true);
                    this.setNextStatement(true);
                    // Allow the api to customise the block further
                    if (m.def.blockly && typeof m.def.blockly.postProcess === 'function') {
                        m.def.blockly.postProcess(this);
                    }
                },
            };
            Blockly.JavaScript[id] = (block : any) => {
                let value;
                if (block.getField(blocklyName)) {
                    value = block.getFieldValue(blocklyName);
                    value = BlocklyMetaRenderer.formatFieldValue(value, m.def.default);
                } else {
                    value = Blockly.JavaScript.valueToCode(block, blocklyName, Blockly.JavaScript.ORDER_ASSIGNMENT);
                    if (value === '') {
                        value = 'null';
                    }
                }
                return `${m.getNameChain('.')} = ${value};\n`;
            };
        };
        const toolbox = BlocklyMetaRenderer.isInToolbox(m);
        const defaults : any = {};
        defaults[blocklyName] = { value: m.def.default };
        if (m.def.blockly && m.def.blockly.shadow) {
            defaults[blocklyName].shadow = m.def.blockly.shadow(m.def.default, m.getRoot());
        } else {
            defaults[blocklyName].shadow = resolveShadowTree(m);
        }
        return { register, id, toolbox, defaults };
    }
    static formatFieldValue(value : any, def : any) {
        if (!value) {
            value = typeof def === 'undefined' ? '' : def;
        }
        if (typeof def === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            value = `'${value}'`;
        }
        return value;
    }
    /**
     * Looks up a Blockly block tree and find a parent block that has a callback function definition
     * with an argument matching the required type. Return the argument name.
     * @param block A blockly block
     * @param returnType A function argument to match
     */
    static findScopedArgument(block : Block, returnType : any) {
        // Look up the tree. The visitor will invalidate each non matching node and return a matching name
        const scope = walkUpstream(block, (b) => {
            // Retrieve the MetaDefinition from the block type
            const blockDefinition = definitionsMap.get(b.type);
            // No definition or no parameters means it cannot create a scope
            if (!blockDefinition || !blockDefinition.def.parameters) {
                return false;
            }
            const { parameters } = blockDefinition as MetaFunction;
            // Look for a function parameters. Those can have scope defined parameters
            const funcParam = parameters.find((param) => param.getReturnType() === Function);
            if (!funcParam) {
                return false;
            }
            // This function, being a callback definition can have parameters. Look for a matching type
            const funcParams = funcParam.def.parameters;
            if (!funcParams) {
                return false;
            }
            // These are the callback function's defined arguments. One might gives us the value we need
            const param = funcParams.find((param) => param.blockly && param.blockly.scope === returnType);
            if (!param) {
                return false;
            }
            return param;
        });
        // No scope found, bail out
        if (!scope) {
            return null;
        }
        // Return argument name
        return scope.name;
    }
    renderFunction(m : MetaFunction) {
        const id = BlocklyMetaRenderer.getId(m);
        const params = m.getParameters();
        const defaults = params.filter(p => typeof p.def.default !== 'undefined').reduce((acc, p) => {
            const pName = p.def.name.toUpperCase();
            acc[pName] = { value: p.def.default };
            if (p.def.blockly && p.def.blockly.shadow) {
                acc[pName].shadow = p.def.blockly.shadow(p.def.default, m.getRoot());
            } else {
                acc[pName].shadow = resolveShadowTree(p);
            }
            return acc;
        }, {} as any);
        // Exclude scoped params for the blockly interface generation
        const blocksParams = params.filter(p => !p.def.blockly || !p.def.blockly.scope);
        const register = (Blockly : any) => {
            Blockly.Blocks[id] = {
                init(this : Block) {
                    this.setColour(m.getColor());
                    this.setOutput(BlocklyMetaRenderer.parseType(m.getReturnType()));
                    if (!blocksParams.length) {
                        this.appendDummyInput()
                            .appendField(BlocklyMetaRenderer.verboseWithPrefix(m));
                    }
                    blocksParams.forEach((p, index) => {
                        const pName = p.def.name.toUpperCase();
                        const input = BlocklyMetaRenderer.parseInputType(p.def.returnType, p);
                        const verbose = p.getVerboseDisplay();
                        const prefix = BlocklyMetaRenderer.verboseWithPrefix(m);
                        const verboseWithPrefix = verbose.length ? `${prefix} ${verbose}` : prefix;
                        const label = index === 0 ? verboseWithPrefix : verbose;
                        let blocklyInput;
                        if (input.type === 'input_statement') {
                            const firstInput = this.appendDummyInput();
                            if (label.length) {
                                firstInput.appendField(label, 'PREFIX');
                            }
                            blocklyInput = this.appendStatementInput(pName);
                        } else if (input.type === 'field_dropdown') {
                            blocklyInput = this.appendDummyInput(pName)
                            if (label.length) {
                                blocklyInput.appendField(label, 'PREFIX');
                            }
                            blocklyInput.appendField(new Blockly.FieldDropdown(p.def.enum), pName);
                        } else if (p.def.blockly && p.def.blockly.customField) {
                            blocklyInput = this.appendDummyInput(pName);
                            if (label.length) {
                                blocklyInput.appendField(label, 'PREFIX');
                            }
                            blocklyInput.appendField(p.def.blockly.customField(Blockly, this), pName);
                        } else if (input.type === 'field_input') {
                            blocklyInput = this.appendDummyInput();
                            if (label.length) {
                                blocklyInput.appendField(label, 'PREFIX');
                            }
                            blocklyInput.appendField(new FieldTextInput(input.text), pName);
                        } else {
                            blocklyInput = this.appendValueInput(pName)
                                .setCheck(input.check);
                            if (label.length) {
                                blocklyInput.appendField(label, 'PREFIX');
                            }
                        }
                        if (index !== 0) {
                            blocklyInput.setAlign(Blockly.ALIGN_RIGHT);
                        }
                    });
                    const output = BlocklyMetaRenderer.parseType(m.getReturnType());
                    this.setOutput(output);
                    if (typeof output === 'undefined') {
                        this.setNextStatement(true);
                        this.setPreviousStatement(true);
                    }
                    this.setInputsInline(blocksParams.length === 2);
                    // Allow the api to customise the block further
                    if (m.def.blockly && typeof m.def.blockly.postProcess === 'function') {
                        m.def.blockly.postProcess(this);
                    }
                },
            };
            Blockly.JavaScript[id] = (block : any) => {
                if (m.def.blockly && typeof m.def.blockly.javascript === 'function') {
                    return m.def.blockly.javascript(Blockly, block, m);
                }
                const values = params.map((p, index) => {
                    if (p.def.blockly && p.def.blockly.scope) {
                        return BlocklyMetaRenderer.findScopedArgument(block, p.def.blockly.scope);
                    }
                    const argName = p.def.name.toUpperCase();
                    const input = block.getInput(argName);
                    const field = block.getField(argName);
                    let value;
                    if (field) {
                        value = block.getFieldValue(argName);
                        value = BlocklyMetaRenderer.formatFieldValue(value, params[index].def.default);
                    } else {
                        switch (input.type) {
                            case Blockly.INPUT_VALUE: {
                                value = Blockly.JavaScript.valueToCode(block, argName, Blockly.JavaScript.ORDER_COMMA);
                                if (!value) {
                                    value = typeof params[index].def.default === 'undefined' ? 'null' : params[index].def.default;
                                }
                                break;
                            }
                            case Blockly.NEXT_STATEMENT: {
                                let statement = Blockly.JavaScript.statementToCode(block, argName);
                                if (!statement) {
                                    statement = typeof params[index].def.default === 'undefined' ? '' : params[index].def.default;
                                }
                                let args : string[] = [];
                                if (params[index].def.parameters) {
                                    params[index].def.parameters!.forEach((param) => {
                                        args.push(param.name);
                                    });
                                }
                                value = `function(${args.join(', ')}) {\n${statement}\n}`;
                                break;
                            }
                            default: {
                                return 'null';
                            }
                        }
                    }
                    return value;
                }).filter(v => v !== null);
                let code : string|string[] = `${m.getNameChain('.')}(${values.join(', ')})`;
                if (block.outputConnection) {
                    code = [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
                } else {
                    code = `${code};\n`;
                }
                return code;
            };
        };
        definitionsMap.set(id, m);
        const aliases : string[] = m.def.blockly && m.def.blockly.aliases ? m.def.blockly.aliases : [];
        aliases.forEach((alias) => {
            (Blockly as any).Blocks[alias] = (Blockly as any).Blocks[id];
            (Blockly as any).JavaScript[alias] = (Blockly as any).JavaScript[id];
            definitionsMap.set(alias, m);
        });
        const toolbox = BlocklyMetaRenderer.isInToolbox(m);
        return [{ register, id, defaults, toolbox }];
    }
    static isInToolbox(m : Meta) {
        return !m.def.disabled && (!m.def.blockly || typeof m.def.blockly.toolbox === 'undefined' || m.def.blockly.toolbox);
    }
    static parseInputType(type : any, param : Meta) {
        if (param.def.blockly && param.def.blockly.customField) {
            return {
                type: 'input_dummy',
            };
        }
        switch (type) {
            case Function: {
                return {
                    type: 'input_statement',
                };
            }
            case 'Enum': {
                return {
                    type: 'field_dropdown',
                    options: param.def.enum || [],
                };
            }
            case Number:
            case String:
            default: {
                if (param.def.blockly && param.def.blockly.field) {
                    switch (type) {
                        case Number:
                            return {
                                type: 'field_number',
                                value: param.def.default,
                            };
                        case String:
                        default:
                            return {
                                type: 'field_input',
                                text: param.def.default,
                            };
                    }
                }
                return {
                    type: 'input_value',
                    check: BlocklyMetaRenderer.parseType(type),
                };
            }
        }
    }
    static parseType(type : any) {
        switch (type) {
            case Number: {
                return 'Number';
            }
            case String: {
                return 'String';
            }
            case 'Color': {
                return 'Colour';
            }
            default: {
                return type;
            }
        }
    }
}

export default BlocklyMetaRenderer;
