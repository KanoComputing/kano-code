/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOUR = '#1298ff';

    let register = (Blockly) => {
        //apply colour to these block, including configure block
        category.colourBlocks = ['procedures_defnoreturn', 'procedures_defreturn',
            'procedures_mutatorcontainer', 'procedures_mutatorarg', 'procedures_callnoreturn',
            'procedures_callreturn', 'procedures_ifreturn'
        ].map((block) => {
            Kano.MakeApps.Blockly.Defaults.categoryMap[block] = block;
            return {
                id: block
            }
        });
        //could consider how to seprate deal with configure block's color, e.g mutator block
        category.colourBlocks.forEach((category) => {
            Kano.Util.Blockly.updateBlockColour(Blockly.Blocks[category.id], COLOUR);
        });

    };
    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_FUNCTION,
        id: 'procedures',
        colour: COLOUR,
        blocks: ['procedures_defnoreturn', 'procedures_defreturn']
    });

    Kano.MakeApps.Blockly.addModule('procedures', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
