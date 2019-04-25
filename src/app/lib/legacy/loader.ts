import { AppModule } from '../app-modules/app-module.js';
import { Editor } from '../editor/editor.js';
import { LegacyUtil } from './util.js';
import { utils } from '@kano/kwc-blockly/blockly.js';

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

function rewriteParts(app : any, editor : Editor) {
    const registered = editor.parts.getRegisteredParts();
    registered.forEach((partClass) => partClass.transformLegacy(app));
}
function rewriteModules(app : any, editor : Editor) {
    const modules = editor.output.runner.getRegisteredModules();
    modules.forEach((mod) => {
        const moduleClass = (mod.constructor as typeof AppModule);
        if (!moduleClass.transformLegacy) {
            return;
        }
        moduleClass.transformLegacy(app);
    });
}

export function transformLegacyApp(app : any, editor : Editor) {
    if (!app) {
        return app;
    }
    rewriteSource(app);
    rewriteModules(app, editor);
    rewriteParts(app, editor);
    return app;
}
