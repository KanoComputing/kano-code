/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOR = '#1198ff';

    let register = (Blockly) => {
        Blockly.Blocks.random_cat = {
            init: function () {
                let json = {
                    id: 'random_cat',
                    colour: COLOR,
                    message0: Blockly.Msg.RANDOM_CAT,
                    output: 'String'
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.random_cat  = () => {
            let code = `cat.random()`;
            return [code];
        };

        Blockly.Pseudo.random_cat  = () => {
            let code = `randomCat()`;
            return [code];
        };
    };
    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_FUN,
        id: 'fun',
        colour: COLOR,
        blocks: ['random_cat']
    });

    Kano.MakeApps.Blockly.addModule('fun', {
        register,
        category
    }, true);

})(window.Kano = window.Kano || {});
