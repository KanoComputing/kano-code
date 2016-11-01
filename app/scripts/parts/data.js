/* globals Blockly */
import Part from './part';

/**
 * Check if a block is the ancestor of another one
 */
function checkAncestor(block, type) {
    let parent = block.parentBlock_;
    if (!parent) {
        return false;
    }
    if (parent.type == type) {
        return true;
    }
    return checkAncestor(parent, type);
}

export default class Data extends Part {
    constructor (opts) {
        super(opts);
        let setConfigOptions,
            getValueOptions;
        this.partType = 'data';
        this.tagName = opts.component || 'kano-part-data';
        this.configPanel = opts.configPanel || 'kano-data-editor';
        this.dataType = opts.dataType || 'object';
        this.dataLength = opts.dataLength || 1;
        this.parameters = opts.parameters || [];
        this.excludeBlocks = opts.excludeBlocks || [];
        this.excludeEvents = opts.excludeEvents || [];
        this.config = opts.config || this.parameters.reduce((acc, param) => {
            acc[param.key] = param.value;
            return acc;
        }, {});
        // Generate the list of options for blockly, excludes the param whose type is list
        setConfigOptions = this.parameters.filter(param => param.type !== 'list').map((param) => {
            return [
                param.label,
                param.key
            ];
        });
        this.dataKeys = opts.dataKeys || [];
        getValueOptions = this.dataKeys.map(dataKey => [dataKey.label, dataKey.key]).concat(setConfigOptions);
        this.refreshEnabled = opts.refreshEnabled || false;
        this.refreshFreq = opts.refreshFreq || 5;
        this.minRefreshFreq = opts.minRefreshFreq || 5;
        this.method = opts.method;
        if (this.excludeEvents.indexOf('update') === -1) {
            this.events = [{
                label: 'updated',
                id: 'update'
            }];
        }
        if (this.excludeBlocks.indexOf('refresh') === -1) {
            this.blocks.push({
                block: (part) => {
                    return {
                        id: 'refresh',
                        message0: `${part.name}: refresh data`,
                        previousStatement: null,
                        nextStatement: null
                    };
                },
                javascript: (part) => {
                    return () => {
                        let code = `devices.get('${part.id}').refresh();`;
                        return code;
                    };
                },
                pseudo: (part) => {
                    return () => {
                        let code = `${part.id}.refresh();\n`;
                        return code;
                    };
                }
            });
        }
        if (setConfigOptions.length) {
            this.blocks.push({
                block: (part) => {
                    return {
                        id: 'set_config',
                        message0: `${part.name}: set %1 to %2`,
                        args0: [{
                            type: "field_dropdown",
                            name: "PARAM",
                            options: setConfigOptions
                        },{
                            type: "input_value",
                            name: "VALUE"
                        }],
                        previousStatement: null,
                        nextStatement: null
                    };
                },
                javascript: (part) => {
                    return function (block) {
                        let value = Blockly.JavaScript.valueToCode(block, 'VALUE'),
                        param = block.getFieldValue('PARAM'),
                        code = `devices.get('${part.id}').setConfig('${param}', ${value});\n`;
                        return code;
                    };
                },
                pseudo: (part) => {
                    return function (block) {
                        let value = Blockly.Pseudo.valueToCode(block, 'VALUE'),
                        param = block.getFieldValue('PARAM'),
                        code = `${part.id}.${param} = ${value};\n`;
                        return code;
                    };
                }
            });
        }
        if (getValueOptions.length) {
            if (this.dataType === 'list') {
                this.blocks.push({
                    block: (part) => {
                        return {
                            id: 'get_value_at',
                            message0: `${part.name}: %1`,
                            args0: [{
                                type: "field_dropdown",
                                name: "KEY",
                                options: getValueOptions
                            }],
                            output: 'Array'
                        };
                    },
                    javascript: (part) => {
                        return function (block) {
                            let key = block.getFieldValue('KEY'),
                                code = `item.${key}`;
                            // If the block is not in his part's for each loop
                            if (!checkAncestor(block, `${part.id}#for_each`)) {
                                code = `devices.get('${part.id}').getData()[0].${key}`;
                            }
                            return [code];
                        };
                    },
                    pseudo: (part) => {
                        return function (block) {
                            let key = block.getFieldValue('KEY'),
                            code = `item.${key}`;
                            return [code];
                        };
                    }
                });
            } else {
                this.blocks.push({
                    block: (part) => {
                        return {
                            id: 'get_value',
                            message0: `${part.name}: %1`,
                            args0: [{
                                type: "field_dropdown",
                                name: "KEY",
                                options: getValueOptions
                            }],
                            output: null
                        };
                    },
                    javascript: (part) => {
                        return function (block) {
                            let key = block.getFieldValue('KEY'),
                            code = `devices.get('${part.id}').getValue('${key}')`;
                            return [code];
                        };
                    },
                    pseudo: (part) => {
                        return function (block) {
                            let key = block.getFieldValue('KEY'),
                            code = `${part.id}.${key}`;
                            return [code];
                        };
                    }
                });
            }
        }
        if (this.dataType === 'list') {
            this.blocks.push({
                block: (part) => {
                    return {
                        id: 'for_each',
                        message0: `for each item in ${part.name}`,
                        message1: 'do %1',
                        args1: [{
                            type: "input_statement",
                            name: "DO"
                        }],
                        previousStatement: null,
                        nextStatement: null
                    };
                },
                javascript: (part) => {
                    return function (block) {
                        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                            code = `devices.get('${part.id}').getData().forEach(function (item) {
                                ${statement}
                            });\n`;
                        return code;
                    };
                },
                pseudo: (part) => {
                    return function (block) {
                        let statement = Blockly.Pseudo.statementToCode(block, 'DO'),
                            code = `for(let item in ${part.id}) {\n${statement}\n}\n`;
                        return code;
                    };
                }
            });
        }
    }
    refresh () {
        return Kano.AppModules.getModule('data').generateRequest(this.id, this.method, this.config);
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        plain.refreshFreq = this.refreshFreq;
        plain.refreshEnabled = this.refreshEnabled;
        plain.method = this.method;
        plain.config = this.config;
        plain.component = this.component;
        return plain;
    }
}
