import { ICategory } from '../meta-api/module.js';

export type IBlocklyCategory = ICategory & {
    blocks : any[];
    order? : number;
}

interface IDefaultValuesMap {
    [K : string] : {
        [K : string] : any;
    };
}

interface ILabelsMap {
    [K : string] : {
        [K : string] : any;
    };
}

class Defaults {
    categoryMap : Map<string, string> = new Map();
    shadowMap : Map<string, any> = new Map();
    labels : ILabelsMap;
    values : IDefaultValuesMap;
    _labels : Map<string, Map<string, Map<string, string>>> = new Map();
    constructor() {
        this.labels = {
            category: {},
        };
        this.values = {};
    }
    getShadowForBlock(type : string, inputs : string[]) {
        const blockValues = this.values[type];
        const shadow : { [k : string] : string } = {};
        if (typeof blockValues === 'undefined') {
            return null;
        }
        inputs.forEach((input) => {
            switch (typeof blockValues[input]) {
            case 'number': {
                shadow[input] = `<shadow type="math_number"><field name="NUM">${blockValues[input]}</field></shadow>`;
                break;
            }
            case 'string': {
                // Check if it is a color
                if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(blockValues[input])) {
                    shadow[input] = `<shadow type="colour_picker"><field name="COLOUR">${blockValues[input]}</field></shadow>`;
                } else {
                    shadow[input] = `<shadow type="text"><field name="TEXT">${blockValues[input]}</field></shadow>`;
                }
                break;
            }
            case 'object': {
                if (blockValues[input].shadow) {
                    shadow[input] = blockValues[input].shadow;
                }
                break;
            }
            default: {
                break;
            }
            }
        });
        return shadow;
    }
    createCategory(opts : IBlocklyCategory) {
        let shadow;
        const blocks = opts.blocks.map((block) => {
            if (typeof block === 'string') {
                // Map the block id to its category
                this.categoryMap.set(block, opts.id);
                return { id: block };
            }
            shadow = block.defaults ?
                this.getShadowForBlock(block.id, block.defaults) : block.shadow;
            // Map the block id to its category
            this.categoryMap.set(block.id, opts.id);
            if (shadow) {
                this.shadowMap.set(block.id, shadow);
            }
            return { id: block.id, shadow };
        });
        this.labels.category[opts.id] = opts.name;
        return {
            name: opts.name,
            id: opts.id,
            colour: opts.colour,
            blocks,
            order: opts.order,
        };
    }
    /**
     * Define a mapping between a value and its label in the scope of a block input
     * @param blockType The type of the block helding the labels
     * @param input The input for which those labels are
     * @param value A value used as key to retrieve a user friendly label
     * @param label The value displayed to the user
     */
    defineLabel(blockType : string, input : string, value : string, label : string) {
        const blockDef = this._labels.get(blockType) || new Map();
        const inputDef = blockDef.get(input) || new Map();
        inputDef.set(value, label);
        blockDef.set(input, inputDef);
        this._labels.set(blockType, blockDef);
    }
    /**
     * Get a label for a value in a block input
     * @param blockType Type of the block hosting the input
     * @param input Name of the input in that block
     * @param value Value for which we want to retrieve the label
     */
    getLabel(blockType : string, input : string, value : string) {
        const blockDef = this._labels.get(blockType);
        if (!blockDef) {
            return null;
        }
        const inputDef = blockDef.get(input);
        if (!inputDef) {
            return null;
        }
        return inputDef.get(value);
    }
    define(blockId : string, defaults : any) {
        this.values[blockId] = defaults;
    }
    getValues() {
        return this.values;
    }
}

export default Defaults;
