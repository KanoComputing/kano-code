import Blockly from './blockly/blockly';
import Interact from 'interact.js';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
import ModelManager from './service/modelManager';
import DragAndDrop from './drag-and-drop';
import config from './config';
import MakeArtService from './service/make-art'

import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

(function (app) {

    DragAndDrop.init({ workspaceFullSize: config.WORKSPACE_FULL_SIZE });

    app.registerBlockly = Blockly.register;

    app.Interact = Interact;

    app.config = config;
    app.part = Part;
    app.stories = Stories;
    app.components = Components;
    app.modelManager = ModelManager;
<<<<<<< b7bb9c34adc7b6d99d2f4cec5f58475fad9b929e
    app.dragAndDrop = DragAndDrop;
=======
    app.MakeArtService = MakeArtService;
>>>>>>> Add make-art box.

    app.defaultCategories = Blockly.categories;

    app.sdk = KanoWorldSdk(config);
    app.sdk.registerForms();

})(window.app = {});
