import BaseLogic from '../../lib/meta-api/modules/logic.js';

// Logic module specific to Kano Code. Adds a collision if statement

class BlocklyLogic extends BaseLogic {
    static register(Blockly) {
        BaseLogic.register(Blockly);
        Blockly.Blocks.if_collides = {
            init() {
                Blockly.Blocks.collision_event.applyCollisionFields('', this);

                this.setOutput('Boolean');

                this.setColour(BaseLogic.color);
            },
            getFirstPartOptions() {
                const parts = Blockly.Blocks.collision_event.getParts() || [];
                const options = parts.map(this.formatPartOption);

                if (!options.length) {
                    options.push(['No available part', '']);
                }

                return options;
            },
            getSecondPartOptions() {
                const parts = Blockly.Blocks.collision_event.getParts() || [];
                const options = parts.filter(part => part.id !== this.getFieldValue('PART1')).map(this.formatPartOption);

                // The @ here is to make sure no part id will collide with this name
                options.push(['Top Edge', "'@top-edge'"]);
                options.push(['Right Edge', "'@right-edge'"]);
                options.push(['Bottom Edge', "'@bottom-edge'"]);
                options.push(['Left Edge', "'@left-edge'"]);

                return options;
            },
            formatPartOption(part) {
                return [part.name, `parts.get('${part.id}')`];
            },
        };

        Blockly.JavaScript.if_collides = (block) => {
            const part1Id = block.getFieldValue('PART1');
            const part2Id = block.getFieldValue('PART2');
            const code = `parts.collisionBetween(${part1Id || null}, ${part2Id})`;
            return [code];
        };
    }
    static get category() {
        const baseCategory = Object.assign({}, BaseLogic.category);
        baseCategory.blocks = baseCategory.blocks.slice(0);
        baseCategory.blocks.push('if_collides');
        return baseCategory;
    }
}

export default BlocklyLogic;
