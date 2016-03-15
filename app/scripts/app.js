import Blockly from './blockly/blockly';
import Interact from 'interact.js';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
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
    app.dragAndDrop = DragAndDrop;
    app.MakeArtService = MakeArtService;

    app.defaultCategories = Blockly.categories;

    app.sdk = KanoWorldSdk(config);
    app.sdk.registerForms();

})(window.app = {});
