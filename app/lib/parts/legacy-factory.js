export const LegacyFactory = (part) => {
    const weight = {
        ui: 101,
        data: 102,
        hardware: 103,
    };
    return class {
        static get type() { return 'blockly'; }
        static get id() { return part.id; }
        static register(Blockly) {
            const definitions = [];
            part.blocks.forEach((definition) => {
                if (typeof definition === 'object') {
                    definitions.push(definition);
                }
            });
            // Also register the legacy blocks to support shares made with previous block API
            part.legacyBlocks.forEach((definition) => {
                if (typeof definition === 'object') {
                    definitions.push(definition);
                }
            });
            definitions.forEach((definition) => {
                const block = definition.block(part);
                block.colour = part.color;
                block.id = `${part.id}#${block.id}`;
                if (!block.doNotRegister) {
                    Blockly.Blocks[block.id] = {
                        init() {
                            this.jsonInit(block);
                        },
                    };
                    Blockly.Blocks[block.id].customColor = block.colour;
                }
                Blockly.JavaScript[block.id] = definition.javascript(part);
            });
        }
        static get category() {
            const categoryBlocks = part.blocks.map((definition) => {
                if (typeof definition === 'string') {
                    return {
                        id: definition,
                        colour: part.colour,
                    };
                }
                const block = definition.block(part);
                block.colour = part.colour;
                block.id = `${part.id}#${block.id}`;
                return {
                    id: block.id,
                    colour: block.colour,
                    shadow: block.shadow,
                };
            });
            return {
                name: part.name,
                id: part.id,
                colour: part.color,
                blocks: categoryBlocks,
                order: weight[part.partType],
            };
        }
        static get defaults() {
            return part.defaults;
        }
    };
};

export default LegacyFactory;
