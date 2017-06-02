/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOR = '#ccdd1e';

    let category,
        register = (Blockly) => {

        category.blocks.forEach((category) => {
            Kano.Util.Blockly.updateBlockColour(Blockly.Blocks[category.id], COLOR);
        });
    };

    category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_LISTS,
        id: 'lists',
        colour: COLOR,
        blocks: [
            'lists_create_empty',
            'lists_create_with',
            'lists_repeat',
            'lists_length',
            'lists_isEmpty',
            'lists_indexOf',
            'lists_getIndex',
            'lists_setIndex'
        ]
    });

    Kano.MakeApps.Blockly.setLookupString('lists_create_empty', 'listEmpty()');
    Kano.MakeApps.Blockly.setLookupString('lists_create_with', 'listWith(1, 2, 3, ...)');
    Kano.MakeApps.Blockly.setLookupString('lists_repeat', 'listRepeat(list, action)');
    Kano.MakeApps.Blockly.setLookupString('lists_length', 'listLength(list)');
    Kano.MakeApps.Blockly.setLookupString('lists_isEmpty', 'listIsEmpty(list)');
    Kano.MakeApps.Blockly.setLookupString('lists_indexOf', 'listIndexOf(list, element)');
    Kano.MakeApps.Blockly.setLookupString('lists_getIndex', 'listGetIndex(list, index)');
    Kano.MakeApps.Blockly.setLookupString('lists_setIndex', 'listSetIndex(list, index, element)');

    Kano.MakeApps.Blockly.addModule('lists', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
