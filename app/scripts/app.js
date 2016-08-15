import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

import Stories from './service/stories';
import Components from './service/components';
import Mode from './mode';
import email from './service/email';
import KanoWorldSdk from 'kano-world-sdk';
import DragAndDrop from './drag-and-drop';
import ProgressService from './service/progress';
import config from './config';

window.Kano = window.Kano || {};

(function (MakeApps) {
    fetch('https://10.0.30.142:8000')
        .then(function (res) {
            console.log(res);
        }).catch(function (err) {
            console.log("err");
        });

    fetch('https://10.0.30.142:8000', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Hubot',
            login: 'hubot'
        })
    })
        .then(function (res) {
            console.log(res);
        }).catch(function (err) {
            console.log("err");
        });

    MakeApps.config = config;

    DragAndDrop.init({ workspaceFullSize: config.WORKSPACE_FULL_SIZE });

    MakeApps.stories = Stories;
    MakeApps.components = Components;
    MakeApps.dragAndDrop = DragAndDrop;

    MakeApps.sdk = KanoWorldSdk(config);
    // Add attach route until supported by the SDK
    MakeApps.sdk.api.add('share.attach', {
        method: 'post',
        route: '/share/attach/:id'
    });
    MakeApps.progress = ProgressService(MakeApps.sdk);
    MakeApps.sdk.registerForms();

    MakeApps.email = email;

    MakeApps.Mode = Mode;

})(window.Kano.MakeApps = window.Kano.MakeApps || {});
