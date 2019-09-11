import { AppModule } from '../app-modules/app-module.js';
import { LegacyUtil } from './util.js';
import { utils } from '@kano/kwc-blockly/blockly.js';
import { Output } from '../index.js';

function rewriteSource(app : any) {
    if (app.code && app.code.snapshot) {
        app.source = app.code.snapshot.blocks;
        delete app.code;
    }
    rewriteBlocks(app);
}

function rewriteBlocks(app : any) {
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    const all = [...root.querySelectorAll('[id]')];
    all.forEach((el) => {
        const id = el.getAttribute('id');
        if (id && /#|>|\.|:/g.test(id)) {
            const newId = utils.genUid();
            el.setAttribute('id', newId);
        }
    });
    const serializer = new XMLSerializer();
    const newSource = serializer.serializeToString(root);
    app.source = newSource;
}

function rewriteParts(app : any, output : Output) {
    const registered = output.parts.getRegisteredParts();
    registered.forEach((partClass) => partClass.transformLegacy(app));
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        app.parts.forEach((d : any) => LegacyUtil.addPartBlocks(d, root));
        app.source = root.outerHTML;
    }
}
function rewriteModules(app : any, output : Output) {
    const modules = output.runner.getRegisteredModules();
    modules.forEach((mod) => {
        const moduleClass = (mod.constructor as typeof AppModule);
        if (!moduleClass.transformLegacy) {
            return;
        }
        moduleClass.transformLegacy(app);
    });
}

function isLegacyApp(app : any) {
    return app.code && app.code.snapshot;
}

export function transformLegacyApp(app : any, output : Output) {
    if (!app) {
        return app;
    }
    rewriteSource(app);
    rewriteModules(app, output);
    if (app.parts && app.parts.length > 0) {
        rewriteParts(app, output);
    }
    return app;
}
