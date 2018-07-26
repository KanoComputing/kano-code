import Defaults from '../../blockly/defaults.js';

class BlocklyMetaRenderer {
    constructor() {
        this.defaults = new Defaults();
    }
    renderLegacyToolboxEntry(mod) {
        mod.def.register(window.Blockly);
        if (mod.def.defaults) {
            Object.keys(mod.def.defaults).forEach((blockId) => {
                this.defaults.define(blockId, mod.def.defaults[blockId]);
            });
        }
        if (!mod.def.category) {
            return null;
        }
        if (mod.def.whitelist) {
            mod.def.category.blocks = mod.def.category.blocks.filter((block) => {
                const id = block.id || block;
                return mod.def.whitelist.indexOf(id) !== -1;
            });
        }
        return this.defaults.createCategory(mod.def.category);
    }
    renderToolboxEntry(mod) {
        // Legacy module signature
        if (mod.def.type && mod.def.type === 'blockly') {
            return this.renderLegacyToolboxEntry(mod);
        }
        const blocks = BlocklyMetaRenderer.render(mod);

        const register = (Blockly) => {
            blocks.forEach(block => block.register(Blockly));
        };

        let filteredBlocks = blocks.filter(block => block.toolbox);

        if (mod.def.whitelist) {
            filteredBlocks = blocks.filter(block => mod.def.whitelist.indexOf(block.id) !== -1);
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
            this.defaults.define(block.id, block.defaults);
        }, {});

        register(window.Blockly);
        if (!filteredBlocks.length || (typeof mod.def.toolbox !== 'undefined' && mod.def.toolbox === false)) {
            return null;
        }

        return this.defaults.createCategory(category);
    }
    static render(m) {
        switch (m.def.type) {
            case 'module':
                {
                    return BlocklyMetaRenderer.renderModule(m);
                }
            case 'variable':
                {
                    return BlocklyMetaRenderer.renderVariable(m);
                }
            case 'function':
                {
                    return BlocklyMetaRenderer.renderFunction(m);
                }
            default:
                {
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
    static renderVariable(m) {
        const json = BlocklyMetaRenderer.renderBaseBlock(m);
        const register = (Blockly) => {
            Blockly.Blocks[json.id] = {
                init() {
                    this.jsonInit(json);
                },
            };
            Blockly.JavaScript[json.id] = () => [m.getNameChain('.')];
        };
        const toolbox = m.def.blockly && typeof m.def.blockly.toolbox !== 'undefined' ? m.def.blockly.toolbox : true;
        return {
            register,
            id: json.id,
            toolbox
        };
    }
    static renderFunction(m) {
        let json = BlocklyMetaRenderer.renderBaseBlock(m);
        if (typeof json.output === 'undefined') {
            json.nextStatement = null;
            json.previousStatement = null;
        }
        const params = m.getParameters();
        const argsMap = new Array(params.length);
        json = params.reduce((acc, p, index) => {
            // Get the input type and check
            const input = BlocklyMetaRenderer.parseInputType(p.def.returnType, p);
            // First Item includes the function name
            if (index === 0) {
                // Append the function name
                acc[`message${index}`] = `${json.message0}`;
                // If the parameter is a callback, force line break
                if (input.type === 'input_statement') {
                    acc[`message${index}`] += ' %1 %2';
                } else {
                    acc[`message${index}`] += ` ${p.getVerboseDisplay()} %1`;
                }
            } else if (input.type === 'input_statement') {
                acc[`message${index}`] = ' %1 %2';
            } else {
                acc[`message${index}`] = ` ${p.getVerboseDisplay()} %1`;
            }
            input.name = p.def.name.toUpperCase();
            argsMap[index] = input.name;
            const args = [input];
            if (input.type === 'input_statement') {
                args.unshift({
                    type: 'input_dummy'
                });
            }
            acc[`args${index}`] = args;
            return acc;
        }, json);
        json.inputsInline = params.length <= 2;
        if (m.def.blockly && typeof m.def.blockly.postProcess === 'function') {
            json = m.def.blockly.postProcess(json);
        }
        const defaults = params.filter(p => typeof p.def.default !== 'undefined').reduce((acc, p) => {
            const pName = p.def.name.toUpperCase();
            if (p.def.blockly && p.def.blockly.shadow) {
                acc[pName] = {
                    shadow: p.def.blockly.shadow(p.def.default),
                    default: p.def.default
                };
            } else {
                acc[pName] = p.def.default;
            }
            if (p.def.enum && p.def.enum.length) {
                acc.label = p.def.enum[0][0]
            }
            return acc;
        }, {});
        const register = (Blockly) => {
            const aliases = m.def.blockly && m.def.blockly.aliases ? m.def.blockly.aliases : [];
            aliases.push(json.id);
            aliases.forEach((alias) => {
                Blockly.Blocks[alias] = {
                    init() {
                        this.jsonInit(json);
                        params.forEach((param) => {
                            if (param.def.blockly && param.def.blockly.customField) {
                                const input = this.getInput(param.def.name.toUpperCase());
                                input.appendField(param.def.blockly.customField(Blockly, this), param.def.name.toUpperCase());
                            }
                        });
                    },
                };
                Blockly.JavaScript[alias] = (block) => {
                    if (m.def.blockly && typeof m.def.blockly.javascript === 'function') {
                        return m.def.blockly.javascript(Blockly, block);
                    }
                    const values = argsMap.map((argName, index) => {
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
                                case Blockly.INPUT_VALUE:
                                    {
                                        value = Blockly.JavaScript.valueToCode(block, argName);
                                        if (!value) {
                                            value = typeof params[index].def.default === 'undefined' ? 'null' : params[index].def.default;
                                        }
                                        break;
                                    }
                                case Blockly.NEXT_STATEMENT:
                                    {
                                        let statement = Blockly.JavaScript.statementToCode(block, argName);
                                        if (!statement) {
                                            statement = typeof params[index].def.default === 'undefined' ? '' : params[index].def.default;
                                        }
                                        value = `function() {\n${statement}\n}`;
                                        break;
                                    }
                                default:
                                    {
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
            });
        };
        const toolbox = m.def.blockly && typeof m.def.blockly.toolbox !== 'undefined' ? m.def.blockly.toolbox : true;
        return {
            register,
            id: json.id,
            defaults,
            toolbox
        };
    }
    static renderBaseBlock(m) {
        const id = m.getNameChain();
        return {
            id,
            colour: m.getColor(),
            message0: m.getVerboseDisplay(),
            output: BlocklyMetaRenderer.parseType(m.getReturnType()),
        };
    }
    static parseInputType(type, param) {
        if (param.def.blockly && param.def.blockly.customField) {
            return {
                type: 'input_dummy',
            };
        }
        switch (type) {
            case Function:
                {
                    return {
                        type: 'input_statement',
                    };
                }
            case 'Enum':
                {
                    return {
                        type: 'field_dropdown',
                        options: param.def.enum || [],
                    };
                }
            case Number:
            case String:
            default:
                {
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
            case Number:
                {
                    return 'Number';
                }
            case String:
                {
                    return 'String';
                }
            case 'Color':
                {
                    return 'Colour';
                }
            default:
                {
                    return type;
                }
        }
    }
}

export default BlocklyMetaRenderer;
