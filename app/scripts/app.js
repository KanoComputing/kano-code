import modules from './language/modules';
import blockly from './blockly';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
import ModelManager from './service/modelManager';
import DragAndDrop from './drag-and-drop';

import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

(function (app) {
    app.config = window.config;

    DragAndDrop.init({ workspaceFullSize: app.config.WORKSPACE_FULL_SIZE });

    app.defaultCategories = [];
    app.registerBlockly = (Blockly) => {
        let mod,
            category;
        // Register default blockly modules
        blockly.register(Blockly);
        // Loop through the modules and register every block
        Object.keys(modules).forEach((moduleName) => {
            mod = modules[moduleName];
            if (typeof mod.config === 'function') {
                mod.config(app.config);
            }
            if (!mod.blocks) {
                return;
            }
            category = {
                name: mod.name,
                colour: mod.colour,
                blocks: []
            };
            mod.blocks.forEach((definition) => {
                let block = definition.block;
                block.colour = mod.colour;
                Blockly.Blocks[block.id] = {
                    init: function () {
                        this.jsonInit(block);
                    }
                };
                Blockly.JavaScript[block.id] = definition.javascript;
                Blockly.Natural[block.id] = definition.natural;
                category.blocks.push({ id: block.id });
            });
            app.defaultCategories.push(category);
        });
    };

    app.part = Part;
    app.stories = Stories;
    app.components = Components;
    app.modelManager = ModelManager;
    app.dragAndDrop = DragAndDrop;

    app.defaultCategories = app.defaultCategories.concat(blockly.categories);

    app.sdk = KanoWorldSdk(app.config);
    app.sdk.registerForms();

})(window.app = {});
