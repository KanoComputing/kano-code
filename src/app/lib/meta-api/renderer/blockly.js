import Defaults from '../../blockly/defaults.js';

class BlocklyMetaRenderer {
    constructor() {
        this.defaults = new Defaults();
    }
    renderLegacyToolboxEntry(mod, whitelist) {
        mod.def.register(window.Blockly);
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
            category.blocks = category.blocks.filter((block) => {
                let id = block.id || block;
                id = id.replace(/^[^#]+(#)/g, '');
                return whitelist.indexOf(id) !== -1;
            });
        }
        return this.defaults.createCategory(category);
    }
    renderToolboxEntry(mod, whitelist) {
        // Legacy module signature
        if (mod.def.type && mod.def.type === 'blockly') {
            return this.renderLegacyToolboxEntry(mod, whitelist);
        }
        const blocks = BlocklyMetaRenderer.render(mod);

        const register = (Blockly) => {
            blocks.forEach(block => block.register(Blockly));
        };

        let filteredBlocks = blocks.filter(block => block.toolbox);
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

        blocks.forEach((block) => {
            this.defaults.define(block.id.replace(prefix, ''), block.defaults);
        }, {});

        register(window.Blockly);
        if (!filteredBlocks.length || (typeof mod.def.toolbox !== 'undefined' && mod.def.toolbox === false)) {
            return null;
        }

        return this.defaults.createCategory(category);
    }
    static render(m) {
        switch (m.def.type) {
            case 'module': {
                return BlocklyMetaRenderer.renderModule(m);
            }
            case 'variable': {
                return BlocklyMetaRenderer.renderVariable(m);
            }
            case 'function': {
                return BlocklyMetaRenderer.renderFunction(m);
            }
            default: {
                break;
            }
        }
        return null;
    }
    static renderModule(m) {
        if (!m.symbols) {
            return [];
        }
        return m.symbols.reduce((acc, sym) => {
            const rendered = BlocklyMetaRenderer.render(sym);
            if (Array.isArray(rendered)) {
                return acc.concat(rendered);
            }
            acc.push(rendered);
            return acc;
        }, []);
    }
    static getId(m) {
        let id = m.getNameChain();
        const root = m.getRoot();
        const blocklyConf = root.def.blockly;
        if (blocklyConf && blocklyConf.idPrefix) {
            id = `${blocklyConf.idPrefix}${id}`;
        }
        return id;
    }
    static renderVariable(m) {
        const id = BlocklyMetaRenderer.getId(m);
        const register = (Blockly) => {
            Blockly.Blocks[id] = {
                init() {
                    this.appendDummyInput()
                        .appendField(m.getVerboseDisplay());
                    this.setColour(m.getColor());
                    this.setOutput(BlocklyMetaRenderer.parseType(m.getReturnType()));
                },
            };
            Blockly.JavaScript[id] = () => [m.getNameChain('.')];
        };
        const toolbox = m.def.blockly && typeof m.def.blockly.toolbox !== 'undefined' ? m.def.blockly.toolbox : true;
        return { register, id, toolbox };
    }
    static renderFunction(m) {
        const id = BlocklyMetaRenderer.getId(m);
        const params = m.getParameters();
        const defaults = params.filter(p => typeof p.def.default !== 'undefined').reduce((acc, p) => {
            const pName = p.def.name.toUpperCase();
            if (p.def.blockly && p.def.blockly.shadow) {
                acc[pName] = { shadow: p.def.blockly.shadow(p.def.default), default: p.def.default };
            } else {
                acc[pName] = p.def.default;
            }
            if (p.def.enum && p.def.enum.length) {
                acc.label = p.def.enum[0][0]
            }
            return acc;
        }, {});
        const register = (Blockly) => {
            Blockly.Blocks[id] = {
                init() {
                    this.setColour(m.getColor());
                    this.setOutput(BlocklyMetaRenderer.parseType(m.getReturnType()));
                    if (!params.length) {
                        this.appendDummyInput()
                            .appendField(m.getVerboseDisplay());
                    }
                    params.forEach((p, index) => {
                        const pName = p.def.name.toUpperCase();
                        const input = BlocklyMetaRenderer.parseInputType(p.def.returnType, p);
                        const label = index === 0 ? `${m.getVerboseDisplay()} ${p.getVerboseDisplay()}` : p.getVerboseDisplay();
                        let blocklyInput;
                        if (input.type === 'input_statement') {
                            const firstInput = this.appendDummyInput();
                            if (label.length) {
                                firstInput.appendField(label);
                            }
                            blocklyInput = this.appendStatementInput(pName);
                        } else if (input.type === 'field_dropdown') {
                            blocklyInput = this.appendDummyInput(pName)
                                .appendField(label)
                                .appendField(new Blockly.FieldDropdown(p.def.enum), pName);
                        } else {
                            blocklyInput = this.appendValueInput(pName)
                                .setCheck(input.check);
                            if (label.length) {
                                blocklyInput.appendField(label);
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
            Blockly.JavaScript[id] = (block) => {
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
                        if (!value) {
                            value = typeof params[index].def.default === 'undefined' ? '' : params[index].def.default;
                        }
                        if (typeof value === 'string') {
                            value = `'${value}'`;
                        }
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
                let code = `${m.getNameChain('.')}(${values.join(', ')})`;
                if (block.outputConnection) {
                    code = [code];
                } else {
                    code = `${code};\n`;
                }
                return code;
            };
        };
        const aliases = m.def.blockly && m.def.blockly.aliases ? m.def.blockly.aliases : [];
        aliases.forEach((alias) => {
            Blockly.Blocks[alias] = Blockly.Blocks[id];
            Blockly.JavaScript[alias] = Blockly.JavaScript[id];
        })
        const toolbox = m.def.blockly && typeof m.def.blockly.toolbox !== 'undefined' ? m.def.blockly.toolbox : true;
        return { register, id, defaults, toolbox };
    }
    static parseInputType(type, param) {
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
    static parseType(type) {
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
