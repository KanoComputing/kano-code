import Defaults from '../../blockly/defaults.js';
import { MetaModule, Meta, MetaVariable, MetaFunction, IMetaRenderer, ICategory } from '../module.js';

interface ILegacyModule {
    def : {
        register(Blockly : any) : void;
        defaults : any;
        category : {
            blocks : any[];
        };
    };
}

interface IRenderedBlock {
    id : string;
    toolbox : boolean;
    defaults? : any[];
    register(Blockly : any) : void;
}

class BlocklyMetaRenderer implements IMetaRenderer {
    private defaults : Defaults;
    constructor() {
        this.defaults = new Defaults();
    }
    renderLegacyToolboxEntry(mod : ILegacyModule, whitelist : any[]) {
        mod.def.register(Blockly);
        if (mod.def.defaults) {
            Object.keys(mod.def.defaults).forEach((blockId) => {
                this.defaults.define(blockId, mod.def.defaults[blockId]);
            });
        }
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
        return this.defaults.createCategory(category);
    }
    renderToolboxEntry(mod : MetaModule, whitelist : any[]) {
        // Legacy module signature
        if (mod.def.type && mod.def.type === 'blockly') {
            return this.renderLegacyToolboxEntry(mod as unknown as ILegacyModule, whitelist);
        }
        const blocks = BlocklyMetaRenderer.render(mod);

        const register = (Blockly : any) => {
            blocks.forEach((block : any) => block.register(Blockly));
        };

        let filteredBlocks = blocks.filter((block : any) => block.toolbox);
        const prefix = mod.def.blockly
            && mod.def.blockly.idPrefix ? mod.def.blockly.idPrefix : '';
        if (whitelist) {
            const expandedWhitelist = whitelist.map(item => `${prefix}${item}`);
            filteredBlocks = filteredBlocks.filter(block => expandedWhitelist.indexOf(block.id) !== -1);
        }

        const category = {
            name: mod.getVerboseDisplay(),
            id: mod.def.name,
            colour: mod.getColor(),
            blocks: filteredBlocks.map((block) => {
                return {
                    id: block.id,
                    defaults: block.defaults ? Object.keys(block.defaults) : [],
                };
            }),
        };

        blocks.forEach((block : any) => {
            this.defaults.define(block.id.replace(prefix, ''), block.defaults);
        }, {});

        register(Blockly);
        if (!filteredBlocks.length || (typeof mod.def.toolbox !== 'undefined' && mod.def.toolbox === false)) {
            return null;
        }

        return this.defaults.createCategory(category) as ICategory;
    }
    disposeToolboxEntry(category : ICategory) {
        
    }
    static render(m : MetaModule) : IRenderedBlock[] {
        switch (m.def.type) {
            case 'module': {
                return BlocklyMetaRenderer.renderModule(m);
            }
            case 'variable': {
                return BlocklyMetaRenderer.renderVariable(m as MetaVariable);
            }
            case 'function': {
                return BlocklyMetaRenderer.renderFunction(m as MetaFunction);
            }
            default: {
                break;
            }
        }
        return [];
    }
    static renderModule(m : MetaModule) {
        if (!m.symbols) {
            return [];
        }
        return m.symbols.reduce((acc, sym) => {
            const rendered = BlocklyMetaRenderer.render(sym);
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
        if (!root.def.blockly || !root.def.blockly.prefix) {
            return m.getVerboseDisplay();
        }
        return `${root.def.blockly.prefix} ${m.getVerboseDisplay()}`;
    }
    static renderGetter(m : MetaVariable) : IRenderedBlock {
        const id = `get_${BlocklyMetaRenderer.getId(m)}`;
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
            Blockly.JavaScript[id] = () => [m.getNameChain('.')];
        };
        const toolbox = m.def.blockly && typeof m.def.blockly.toolbox !== 'undefined' ? m.def.blockly.toolbox : true;
        return { register, id, toolbox };
    }
    static renderSetter(m : MetaVariable) : IRenderedBlock {
        const id = `set_${BlocklyMetaRenderer.getId(m)}`;
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
                    value = Blockly.JavaScript.valueToCode(block, blocklyName);
                    if (value === '') {
                        value = 'null';
                    }
                }
                return `${m.getNameChain('.')} = ${value};\n`;
            };
        };
        const toolbox = m.def.blockly && typeof m.def.blockly.toolbox !== 'undefined' ? m.def.blockly.toolbox : true;
        const defaults : any = {};
        if (m.def.blockly && m.def.blockly.shadow) {
            defaults[blocklyName] = { shadow: m.def.blockly.shadow(m.def.default, m.getRoot()), default: m.def.default };
        } else {
            defaults[blocklyName] = m.def.default;
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
    static renderFunction(m : MetaFunction) {
        const id = BlocklyMetaRenderer.getId(m);
        const params = m.getParameters();
        const defaults = params.filter(p => typeof p.def.default !== 'undefined').reduce((acc, p) => {
            const pName = p.def.name.toUpperCase();
            if (p.def.blockly && p.def.blockly.shadow) {
                acc[pName] = { shadow: p.def.blockly.shadow(p.def.default, m.getRoot()), default: p.def.default };
            } else {
                acc[pName] = p.def.default;
            }
            if (p.def.enum && p.def.enum.length) {
                acc.label = p.def.enum[0][0]
            }
            return acc;
        }, {} as any);
        const register = (Blockly : any) => {
            Blockly.Blocks[id] = {
                init() {
                    this.setColour(m.getColor());
                    this.setOutput(BlocklyMetaRenderer.parseType(m.getReturnType()));
                    if (!params.length) {
                        this.appendDummyInput()
                            .appendField(BlocklyMetaRenderer.verboseWithPrefix(m));
                    }
                    params.forEach((p, index) => {
                        const pName = p.def.name.toUpperCase();
                        const input = BlocklyMetaRenderer.parseInputType(p.def.returnType, p);
                        const label = index === 0 ? `${BlocklyMetaRenderer.verboseWithPrefix(m)} ${p.getVerboseDisplay()}` : p.getVerboseDisplay();
                        let blocklyInput;
                        if (input.type === 'input_statement') {
                            const firstInput = this.appendDummyInput();
                            if (label.length) {
                                firstInput.appendField(label, 'PREFIX');
                            }
                            blocklyInput = this.appendStatementInput(pName);
                        } else if (input.type === 'field_dropdown') {
                            blocklyInput = this.appendDummyInput(pName)
                                .appendField(label, 'PREFIX')
                                .appendField(new Blockly.FieldDropdown(p.def.enum), pName);
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
                        if (p.def.blockly && p.def.blockly.customField) {
                            blocklyInput.appendField(p.def.blockly.customField(Blockly, this), pName);
                        }
                    });
                    const output = BlocklyMetaRenderer.parseType(m.getReturnType());
                    this.setOutput(output);
                    if (typeof output === 'undefined') {
                        this.setNextStatement(true);
                        this.setPreviousStatement(true);
                    }
                    this.setInputsInline(params.length === 2);
                    // Allow the api to customise the block further
                    if (m.def.blockly && typeof m.def.blockly.postProcess === 'function') {
                        m.def.blockly.postProcess(this);
                    }
                },
            };
            Blockly.JavaScript[id] = (block : any) => {
                if (m.def.blockly && typeof m.def.blockly.javascript === 'function') {
                    return m.def.blockly.javascript(Blockly, block);
                }
                const values = params.map((p, index) => {
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
                                value = Blockly.JavaScript.valueToCode(block, argName);
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
                                value = `function() {\n${statement}\n}`;
                                break;
                            }
                            default: {
                                return 'null';
                            }
                        }
                    }
                    return value;
                });
                let code : string|string[] = `${m.getNameChain('.')}(${values.join(', ')})`;
                if (block.outputConnection) {
                    code = [code];
                } else {
                    code = `${code};\n`;
                }
                return code;
            };
        };
        const aliases : string[] = m.def.blockly && m.def.blockly.aliases ? m.def.blockly.aliases : [];
        aliases.forEach((alias) => {
            (Blockly as any).Blocks[alias] = (Blockly as any).Blocks[id];
            (Blockly as any).JavaScript[alias] = (Blockly as any).JavaScript[id];
        });
        const toolbox = m.def.blockly && typeof m.def.blockly.toolbox !== 'undefined' ? m.def.blockly.toolbox : true;
        return [{ register, id, defaults, toolbox }];
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
